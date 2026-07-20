import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/db.js";

// Parallel Execution for Speed
export const getDashboardMetrics = async () => {
  const todayStartBoundary = new Date();
  todayStartBoundary.setHours(0, 0, 0, 0);

  // Firing all count queries simultaneously
  const [unreadInquiries, todayInquiries, publishedProjects, publishedPages, publishedBlogs] = await Promise.all([
    prisma.contactSubmission.count({ where: { isViewed: false, deletedAt: null } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: todayStartBoundary }, deletedAt: null } }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.page.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.blog.count({ where: { status: "PUBLISHED", deletedAt: null } })
  ]);

  return {
    unreadInquiries,
    newInquiriesToday: todayInquiries,
    publishedProjects,
    publishedPages,
    publishedBlogs
  };
};

// Lead Generation Chart Data (Raw SQL)
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

  // Format date to ISO string for frontend charting libraries
  return rawChartData.map(row => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count)
  }));
};

export const getSystemGlobalActivity = async () => {
  const limit = 10;

  // Fetch recent activities from different structural tables simultaneously
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
      status: true,
      createdAt: true,
      ipAddress: true
    }
  });

  const headers = ["Name", "Email", "Phone", "Status", "Date Submitted", "IP Address"];

  // Map database rows to CSV format
  const rows = leads.map(lead => {
    return [
      lead.name,
      lead.email,
      lead.phone || "N/A",
      lead.status,
      lead.createdAt.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      lead.ipAddress || "N/A"
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  return csvContent;
};