import { getPagesForSitemap } from "../pages/pages.repository.js";
import { getBlogsForSitemap } from "../blogs/blogs.repository.js";

const escapeXml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const generateXmlUrlNode = (url, lastmod, priority) => {
  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
};

export const generateRobotsTxt = (baseUrl) => {
  return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`;
};

export const generateSitemapIndex = (baseUrl) => {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(baseUrl + '/sitemap-pages.xml')}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${escapeXml(baseUrl + '/sitemap-blogs.xml')}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
};

export const generatePagesSitemap = async (baseUrl) => {
  const pages = await getPagesForSitemap();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  xml += generateXmlUrlNode(`${baseUrl}`, new Date(), "1.0") + "\n";
  
  pages.forEach(page => {
    if (page.fullPath === "/" || page.fullPath === "") return;

    // Depth priority calculation
    let priority = "0.8";
    if (page.fullPath.split("/").filter(Boolean).length === 1) priority = "0.9";

    const url = `${baseUrl}${page.fullPath}`;
    const lastModDate = page.updatedAt || page.publishedAt || new Date();
    
    xml += generateXmlUrlNode(url, lastModDate, priority) + "\n";
  });
  
  xml += `</urlset>`;
  return xml;
};

export const generateBlogsSitemap = async (baseUrl) => {
  const blogs = await getBlogsForSitemap();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  let latestBlogDate = new Date();
  if (blogs.length > 0) {
    latestBlogDate = blogs.reduce((latest, current) => {
      const currentMod = current.updatedAt || current.publishedAt || new Date();
      return currentMod > latest ? currentMod : latest;
    }, new Date(0));
  }

  xml += generateXmlUrlNode(`${baseUrl}/blog`, latestBlogDate, "0.9") + "\n";

  blogs.forEach(blog => {
    const url = `${baseUrl}/blog/${blog.slug}`;
    const lastModDate = blog.updatedAt || blog.publishedAt || new Date();
    xml += generateXmlUrlNode(url, lastModDate, "0.7") + "\n";
  });
  
  xml += `</urlset>`;
  return xml;
};