import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import axios from "axios";

const calculateGrowth = async (model, whereCondition = {}) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = currentMonthStart;

  const [totalCount, currentCount, prevCount] = await Promise.all([
    prisma[model].count({ where: whereCondition }), 
    prisma[model].count({ where: { ...whereCondition, createdAt: { gte: currentMonthStart } } }),
    prisma[model].count({ where: { ...whereCondition, createdAt: { gte: prevMonthStart, lt: prevMonthEnd } } })
  ]);

  let growth = 0;
  if (prevCount === 0) {
    growth = currentCount > 0 ? 100 : 0; 
  } else {
    growth = ((currentCount - prevCount) / prevCount) * 100;
  }
  
  return { 
    count: totalCount,
    growth: Math.round(growth) 
  };
};

export const getDashboardMetrics = async () => {
  const [inquiries, projects, pages, blogs] = await Promise.all([
    calculateGrowth('contactSubmission', { deletedAt: null }),
    calculateGrowth('project', { status: 'PUBLISHED' }),
    calculateGrowth('page', { status: 'PUBLISHED', deletedAt: null }),
    calculateGrowth('blog', { status: 'PUBLISHED', deletedAt: null })
  ]);

  return {
    unreadInquiries: await prisma.contactSubmission.count({ where: { isViewed: false, deletedAt: null } }),
    newInquiriesToday: await prisma.contactSubmission.count({ 
      where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) }, deletedAt: null } 
    }),
    inquiries,
    projects,
    pages,
    blogs
  };
};

export const getLeadChartTimeline = async (range) => {
  let daysToSubtract = 30;
  if (range === "7D") daysToSubtract = 7;
  if (range === "1Y") daysToSubtract = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToSubtract);
  startDate.setHours(0, 0, 0, 0);

  const rawChartData = await prisma.$queryRaw`
    SELECT 
      DATE(createdAt) as date, 
      CAST(COUNT(id) AS UNSIGNED) as count
    FROM contact_submissions
    WHERE createdAt >= ${startDate} AND deletedAt IS NULL
    GROUP BY DATE(createdAt)
    ORDER BY DATE(createdAt) ASC
  `;

  return rawChartData.map(row => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count)
  }));
};

export const getSystemGlobalActivity = async () => {
  const limit = 10;

  const [leadLogs, blogRevisions, pageRevisions] = await Promise.all([
    prisma.contactSubmissionLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { name: true } } }
    }),
    prisma.blogRevision.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { 
        actor: { select: { name: true } },
        blog: { select: { title: true } }
      }
    }),
    prisma.pageRevision.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { 
        actor: { select: { name: true } },
        page: { select: { title: true } }
      }
    })
  ]);

  const unifiedTimeline = [];

  leadLogs.forEach(log => {
    unifiedTimeline.push({
      id: `lead_${log.id}`,
      type: 'LEAD',
      text: log.actor 
        ? `${log.actor.name} updated lead status to ${log.toStatus}`
        : `System updated lead to ${log.toStatus}`,
      time: log.createdAt
    });
  });

  blogRevisions.forEach(rev => {
    unifiedTimeline.push({
      id: `blog_${rev.id}`,
      type: 'BLOG',
      text: rev.actor 
        ? `${rev.actor.name} updated blog: "${rev.blog.title}"`
        : `Blog "${rev.blog.title}" was modified`,
      time: rev.createdAt
    });
  });

  pageRevisions.forEach(rev => {
    unifiedTimeline.push({
      id: `page_${rev.id}`,
      type: 'PAGE',
      text: rev.actor 
        ? `${rev.actor.name} updated page: "${rev.page.title}"`
        : `Page "${rev.page.title}" was modified`,
      time: rev.createdAt
    });
  });

  return unifiedTimeline
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, limit);
};

export const exportLeadsToCSV = async () => {
  const leads = await prisma.contactSubmission.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      sourcePage: true,
      status: true,
      spamScore: true,
      createdAt: true,
      ipAddress: true
    }
  });

  const headers = [
    "Name", "Email", "Phone", "Subject", "Message", 
    "Source Page", "Status", "Spam Score", "Date Submitted", "IP Address"
  ];

  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.phone || "N/A",
    lead.subject || "N/A",
    lead.message || "N/A",
    lead.sourcePage || "N/A",
    lead.status,
    lead.spamScore,
    lead.createdAt.toISOString().split("T")[0],
    lead.ipAddress || "N/A"
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  return csvContent;
};

export const getRealTimeIndianVisitors = async () => {
  if (!env.MATOMO_URL || !env.MATOMO_SITE_ID || !env.MATOMO_TOKEN) {
    console.log("Matomo ENV variables are missing. Please check your .env file or server settings.");
    return [];
  }

  const cleanUrl = env.MATOMO_URL.replace("MATOMO_URL=", "");

  try {
    const matomoApiUrl = `${cleanUrl}/index.php?module=API&method=Live.getLastVisitsDetails&idSite=${env.MATOMO_SITE_ID}&period=day&date=today&format=JSON&token_auth=${env.MATOMO_TOKEN}&filter_limit=20`;
    
    console.log("Fetching Live Visitors from:", matomoApiUrl.replace(env.MATOMO_TOKEN, "HIDDEN_TOKEN"));
    
    const response = await axios.get(matomoApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 10000 
    });
    
    const visits = response.data;

    if (visits.result === 'error') {
      console.error("Matomo API Error Message:", visits.message);
      return [];
    }

    if (!Array.isArray(visits)) {
      console.log("Matomo returned unexpected format, likely an HTML block page.");
      return [];
    }

    console.log(`Successfully fetched ${visits.length} total recent visits from Matomo Cloud.`);

    const indianVisitors = visits
      .filter(visit => {
        const countryCode = visit.countryCode ? visit.countryCode.toLowerCase() : "";
        const countryName = visit.country ? visit.country.toLowerCase() : "";
        return countryCode === "in" || countryName === "india";
      })
      .map(visit => {
        const lat = parseFloat(visit.location_lat || visit.location_latitude) || (22 + (Math.random() * 2 - 1));
        const lng = parseFloat(visit.location_long || visit.location_longitude) || (80 + (Math.random() * 2 - 1));

        return {
          name: visit.city || 'India',
          coordinates: [lng, lat],
          device: visit.deviceType,
          time: visit.serverTimePretty
        };
      });

    console.log(`Filtered ${indianVisitors.length} visitors exactly from India.`);
    
    return indianVisitors;
  } catch (error) {
    console.error("Matomo Live Tracking Axios Error:", error.response ? error.response.data : error.message);
    return []; 
  }
};