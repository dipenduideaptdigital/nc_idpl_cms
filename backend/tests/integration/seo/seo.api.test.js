import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";

describe("SEO API Integration Tests", () => {
  const runId = Date.now().toString();
  const baseClientUrl = process.env.CLIENT_URL || "https://subhaakritee.vercel.app";
  
  let authorId = "";
  let systemRoleId = "";

  beforeAll(async () => {
    // Setup minimal requirements for foreign keys
    const role = await prisma.systemRole.upsert({
      where: { slug: "USER" },
      update: {},
      create: { name: "User", slug: "USER" }
    });
    systemRoleId = role.id;

    const author = await prisma.user.create({
      data: {
        name: `SEO Author ${runId}`,
        email: `seo_author_${runId}@test.com`,
        password: "TempPassword123!",
        status: "ACTIVE",
        systemRoleId: systemRoleId
      }
    });
    authorId = author.id;

    // Setup Page Fixtures
    const pageFixtures = [
      { slug: `pub-${runId}`, fullPath: `/pub-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: false },
      { slug: `draft-${runId}`, fullPath: `/draft-${runId}`, status: "DRAFT", includeInSitemap: true, noIndex: false },
      { slug: `archived-${runId}`, fullPath: `/archived-${runId}`, status: "ARCHIVED", includeInSitemap: true, noIndex: false },
      { slug: `no-sitemap-${runId}`, fullPath: `/no-sitemap-${runId}`, status: "PUBLISHED", includeInSitemap: false, noIndex: false },
      { slug: `no-index-${runId}`, fullPath: `/no-index-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: true },
      { slug: `deleted-${runId}`, fullPath: `/deleted-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: false, deletedAt: new Date() },
      { slug: `nested-${runId}`, fullPath: `/parent/nested-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: false },
    ];

    await prisma.page.createMany({
      data: pageFixtures.map(p => ({
        ...p,
        title: `Page ${p.slug}`,
        content: { blocks: [] },
        authorId: authorId,
        updatedById: authorId,
        publishedAt: p.status === "PUBLISHED" ? new Date() : null
      }))
    });

    // Setup Blog Fixtures
    const blogFixtures = [
      { slug: `b-pub-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: false },
      { slug: `b-draft-${runId}`, status: "DRAFT", includeInSitemap: true, noIndex: false },
      { slug: `b-no-sitemap-${runId}`, status: "PUBLISHED", includeInSitemap: false, noIndex: false },
      { slug: `b-no-index-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: true },
      { slug: `b-deleted-${runId}`, status: "PUBLISHED", includeInSitemap: true, noIndex: false, deletedAt: new Date() },
    ];

    await prisma.blog.createMany({
      data: blogFixtures.map(b => ({
        ...b,
        title: `Blog ${b.slug}`,
        content: { blocks: [] },
        authorId: authorId,
        publishedAt: b.status === "PUBLISHED" ? new Date() : null
      }))
    });
  });

  afterAll(async () => {
    // Teardown run-specific records
    await prisma.page.deleteMany({ where: { slug: { contains: runId } } });
    await prisma.blog.deleteMany({ where: { slug: { contains: runId } } });
    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    await prisma.$disconnect();
  });

  // Public routes, response headers & robots.txt
  describe("A. Robots.txt and Headers", () => {
    it("SEO-01, SEO-02, SEO-03, SEO-04: Should return robots.txt with correct rules, headers, and sitemap URL", async () => {
      const response = await request(app).get("/api/v1/robots.txt");
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/plain/);
      expect(response.headers["cache-control"]).toBe("public, max-age=3600");
      
      const text = response.text;
      expect(text).toContain("User-agent: *");
      expect(text).toContain("Allow: /");
      expect(text).toContain(`Sitemap: ${baseClientUrl}/sitemap.xml`);
    });
  });

  // Sitemap index
  describe("B. Sitemap Index", () => {
    it("SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10: Should return valid sitemap index XML", async () => {
      const response = await request(app).get("/api/v1/sitemap.xml");
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/xml/);
      expect(response.headers["cache-control"]).toBe("public, max-age=3600");

      const xml = response.text;
      // Declaration
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      // Namespace
      expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      // Child references
      expect(xml).toContain(`<loc>${baseClientUrl}/sitemap-pages.xml</loc>`);
      expect(xml).toContain(`<loc>${baseClientUrl}/sitemap-blogs.xml</loc>`);
      // alid Date format YYYY-MM-DD
      expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });
  });

  // Page sitemap & SEO metadata formatting
  describe("C & D. Pages Sitemap Database Integration & Formatting", () => {
    let xml = "";

    beforeAll(async () => {
      const response = await request(app).get("/api/v1/sitemap-pages.xml");
      xml = response.text;
    });

    it("SEO-11, SEO-12: Endpoint returns valid XML and includes the Base Homepage URL", () => {
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain(`<loc>${baseClientUrl}</loc>`);
    });

    it("SEO-13: Includes published, indexable page with sitemap enabled", () => {
      expect(xml).toContain(`<loc>${baseClientUrl}/pub-${runId}</loc>`);
    });

    it("SEO-14: Excludes DRAFT and ARCHIVED pages", () => {
      expect(xml).not.toContain(`/draft-${runId}</loc>`);
      expect(xml).not.toContain(`/archived-${runId}</loc>`);
    });

    it("SEO-15, SEO-16, SEO-17: Excludes includeInSitemap:false, noIndex:true, and soft-deleted pages", () => {
      expect(xml).not.toContain(`/no-sitemap-${runId}</loc>`);
      expect(xml).not.toContain(`/no-index-${runId}</loc>`);
      expect(xml).not.toContain(`/deleted-${runId}</loc>`);
    });

    it("SEO-18: Includes nested pages correctly formatted", () => {
      expect(xml).toContain(`<loc>${baseClientUrl}/parent/nested-${runId}</loc>`);
    });

    it("SEO-20, SEO-21: Applies priority 0.9 for top-level pages and 0.8 for nested pages", () => {
      // Top level check
      const topLevelMatch = new RegExp(`<loc>${baseClientUrl}/pub-${runId}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>\\s*<changefreq>weekly</changefreq>\\s*<priority>0.9</priority>`);
      expect(xml).toMatch(topLevelMatch);

      // Nested check
      const nestedMatch = new RegExp(`<loc>${baseClientUrl}/parent/nested-${runId}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>\\s*<changefreq>weekly</changefreq>\\s*<priority>0.8</priority>`);
      expect(xml).toMatch(nestedMatch);
    });

    it("SEO-22: Formats lastmod to ISO date-only format (YYYY-MM-DD)", () => {
      expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });
  });

  //  Blog sitemap & Dates/Priorities
  describe("E & F. Blogs Sitemap Database Integration & Formatting", () => {
    let xml = "";

    beforeAll(async () => {
      const response = await request(app).get("/api/v1/sitemap-blogs.xml");
      xml = response.text;
    });

    it("SEO-23, SEO-24: Endpoint returns XML and ALWAYS includes /blog listing URL", () => {
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain(`<loc>${baseClientUrl}/blog</loc>`);
    });

    it("SEO-31: /blog listing has priority 0.9", () => {
      const listingMatch = new RegExp(`<loc>${baseClientUrl}/blog</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>\\s*<changefreq>weekly</changefreq>\\s*<priority>0.9</priority>`);
      expect(xml).toMatch(listingMatch);
    });

    it("SEO-25, SEO-30: Includes published, indexable blog with individual priority 0.7", () => {
      const individualMatch = new RegExp(`<loc>${baseClientUrl}/blog/b-pub-${runId}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>\\s*<changefreq>weekly</changefreq>\\s*<priority>0.7</priority>`);
      expect(xml).toMatch(individualMatch);
    });

    it("SEO-26, SEO-27, SEO-28, SEO-29: Excludes DRAFT, no-sitemap, no-index, and deleted blogs", () => {
      expect(xml).not.toContain(`/blog/b-draft-${runId}</loc>`);
      expect(xml).not.toContain(`/blog/b-no-sitemap-${runId}</loc>`);
      expect(xml).not.toContain(`/blog/b-no-index-${runId}</loc>`);
      expect(xml).not.toContain(`/blog/b-deleted-${runId}</loc>`);
    });

    it("SEO-32, SEO-33: /blog listing includes a valid date even if calculations drop back to current date", () => {
      expect(xml).toMatch(new RegExp(`<loc>${baseClientUrl}/blog</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`));
    });
  });

  // Base URL configuration
  describe("G. Base URL Configuration (CLIENT_URL Behavior)", () => {
    let originalClientUrl;

    beforeAll(() => {
      originalClientUrl = process.env.CLIENT_URL;
    });

    afterAll(() => {
      process.env.CLIENT_URL = originalClientUrl; 
    });

    it("SEO-35: Respects configured CLIENT_URL", async () => {
      process.env.CLIENT_URL = "https://custom-seo-domain.com";
      const response = await request(app).get("/api/v1/robots.txt");
      expect(response.text).toContain("Sitemap: https://custom-seo-domain.com/sitemap.xml");
    });

    it("SEO-36: Safely removes trailing slash from CLIENT_URL to prevent duplicate slashes", async () => {
      process.env.CLIENT_URL = "https://slash-domain.com/";
      const response = await request(app).get("/api/v1/robots.txt");
      
      expect(response.text).toContain("Sitemap: https://slash-domain.com/sitemap.xml");
      expect(response.text).not.toContain("https://slash-domain.com//sitemap.xml");
    });

    it("SEO-37: Falls back to default source URL if CLIENT_URL is completely unset", async () => {
      delete process.env.CLIENT_URL;
      const response = await request(app).get("/api/v1/robots.txt");
      
      expect(response.text).toContain("Sitemap: https://subhaakritee.vercel.app/sitemap.xml");
    });
  });
});