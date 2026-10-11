import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as seoService from "../../../src/modules/seo/seo.service.js";
import * as pagesRepo from "../../../src/modules/pages/pages.repository.js";
import * as blogsRepo from "../../../src/modules/blogs/blogs.repository.js";

// Mock boundaries
vi.mock("../../../src/modules/pages/pages.repository.js");
vi.mock("../../../src/modules/blogs/blogs.repository.js");

describe("SEO Service", () => {
  const baseUrl = "https://example.com";
  const fixedDateStr = "2026-10-09T10:00:00.000Z";
  const fixedDate = new Date(fixedDateStr);
  const fixedDateYMD = "2026-10-09";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("1. generateRobotsTxt()", () => {
    it("SEO01, SEO02, SEO03: should return correct robots.txt content with baseUrl", () => {
      const robotsTxt = seoService.generateRobotsTxt(baseUrl);
      
      expect(robotsTxt).toContain("User-agent: *");
      expect(robotsTxt).toContain("Allow: /");
      expect(robotsTxt).toContain(`Sitemap: ${baseUrl}/sitemap.xml`);
    });
  });

  describe("2. generateSitemapIndex()", () => {
    it("SEO05, SEO06, SEO07, SEO08: should generate valid XML sitemap index with current dates", () => {
      const xml = seoService.generateSitemapIndex(baseUrl);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain(`<loc>${baseUrl}/sitemap-pages.xml</loc>`);
      expect(xml).toContain(`<loc>${baseUrl}/sitemap-blogs.xml</loc>`);
      
      // Date should be fixed YYYY-MM-DD
      const dateMatches = xml.match(new RegExp(`<lastmod>${fixedDateYMD}</lastmod>`, 'g'));
      expect(dateMatches.length).toBe(2);
      expect(xml).toContain('</sitemapindex>');
    });

    it("SEO09: should escape XML special characters in baseUrl", () => {
      const weirdBaseUrl = "https://example.com/site?id=1&name=<test>'\"";
      const xml = seoService.generateSitemapIndex(weirdBaseUrl);
      
      // Checking for XML escaping: & -> &amp;, < -> &lt;, etc.
      expect(xml).toContain("https://example.com/site?id=1&amp;name=&lt;test&gt;&apos;&quot;");
    });
  });

  describe("3. generatePagesSitemap()", () => {
    it("SEO11, SEO12, SEO21: should call repo and generate base homepage node even if pages array is empty", async () => {
      pagesRepo.getPagesForSitemap.mockResolvedValue([]);
      const xml = await seoService.generatePagesSitemap(baseUrl);

      expect(pagesRepo.getPagesForSitemap).toHaveBeenCalledTimes(1);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      
      // Homepage priority 1.0
      expect(xml).toContain(`<loc>${baseUrl}</loc>`);
      expect(xml).toContain(`<priority>1.0</priority>`);
      expect(xml).toContain('</urlset>');
    });

    it("SEO13, SEO14, SEO15, SEO16: should skip root paths and assign correct priorities based on depth", async () => {
      pagesRepo.getPagesForSitemap.mockResolvedValue([
        { fullPath: "/", updatedAt: new Date() },
        { fullPath: "", updatedAt: new Date() },
        { fullPath: "/about", updatedAt: new Date() },         // Depth 1 -> Priority 0.9
        { fullPath: "/about/team", updatedAt: new Date() },    // Depth 2 -> Priority 0.8
      ]);

      const xml = await seoService.generatePagesSitemap(baseUrl);

      // Homepage generated separately
      expect(xml.split(`<loc>${baseUrl}</loc>`).length).toBe(2); 
      // Ignored "/" and ""
      expect(xml).not.toContain(`<loc>${baseUrl}/</loc>`);

      // Priority checks
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/about</loc>[\\s\\S]*?<priority>0.9</priority>`));
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/about/team</loc>[\\s\\S]*?<priority>0.8</priority>`));
    });

    it("SEO17, SEO18, SEO19: should prioritize updatedAt > publishedAt > current date", async () => {
      const d1 = new Date("2026-01-01T00:00:00Z");
      const d2 = new Date("2026-02-02T00:00:00Z");

      pagesRepo.getPagesForSitemap.mockResolvedValue([
        { fullPath: "/p1", updatedAt: d1, publishedAt: d2 }, // prefers updatedAt
        { fullPath: "/p2", updatedAt: null, publishedAt: d2 }, // prefers publishedAt
        { fullPath: "/p3", updatedAt: null, publishedAt: null }, // fallback to fixed current date
      ]);

      const xml = await seoService.generatePagesSitemap(baseUrl);

      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/p1</loc>\\s*<lastmod>2026-01-01</lastmod>`));
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/p2</loc>\\s*<lastmod>2026-02-02</lastmod>`));
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/p3</loc>\\s*<lastmod>${fixedDateYMD}</lastmod>`));
    });

    it("SEO20: should escape special XML characters in URL", async () => {
      pagesRepo.getPagesForSitemap.mockResolvedValue([
        { fullPath: "/weird&<>'\"path", updatedAt: new Date() }
      ]);
      const xml = await seoService.generatePagesSitemap(baseUrl);
      expect(xml).toContain(`${baseUrl}/weird&amp;&lt;&gt;&apos;&quot;path`);
    });

    it("SEO22: should propagate repository rejections", async () => {
      pagesRepo.getPagesForSitemap.mockRejectedValue(new Error("DB Error"));
      await expect(seoService.generatePagesSitemap(baseUrl)).rejects.toThrow("DB Error");
    });
  });

  describe("4. generateBlogsSitemap()", () => {
    it("SEO23, SEO24, SEO25, SEO31: should call repo and generate base /blog listing URL with 0.9 priority and fallback date", async () => {
      blogsRepo.getBlogsForSitemap.mockResolvedValue([]);
      const xml = await seoService.generateBlogsSitemap(baseUrl);

      expect(blogsRepo.getBlogsForSitemap).toHaveBeenCalledTimes(1);
      expect(xml).toContain(`<loc>${baseUrl}/blog</loc>`);
      expect(xml).toContain(`<priority>0.9</priority>`);
      expect(xml).toContain(`<lastmod>${fixedDateYMD}</lastmod>`); // SEO31 fallback to current date
    });

    it("SEO26, SEO27: should generate URL for each blog slug with priority 0.7", async () => {
      blogsRepo.getBlogsForSitemap.mockResolvedValue([
        { slug: "blog-1", updatedAt: new Date() }
      ]);
      const xml = await seoService.generateBlogsSitemap(baseUrl);
      
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/blog/blog-1</loc>[\\s\\S]*?<priority>0.7</priority>`));
    });

    it("SEO28, SEO29, SEO30: should calculate latest date for /blog and prioritize updatedAt over publishedAt for individuals", async () => {
      const oldDate = new Date("2026-01-01T00:00:00Z");
      const latestDate = new Date("2026-05-05T00:00:00Z");
      const midDate = new Date("2026-03-03T00:00:00Z");

      blogsRepo.getBlogsForSitemap.mockResolvedValue([
        { slug: "b1", updatedAt: oldDate }, 
        { slug: "b2", updatedAt: latestDate }, // Max date is in the middle
        { slug: "b3", updatedAt: null, publishedAt: midDate }, 
      ]);

      const xml = await seoService.generateBlogsSitemap(baseUrl);

      // Check listing URL has the latest date (2026-05-05)
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/blog</loc>\\s*<lastmod>2026-05-05</lastmod>`));

      // Individual dates
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/blog/b1</loc>\\s*<lastmod>2026-01-01</lastmod>`));
      expect(xml).toMatch(new RegExp(`<loc>${baseUrl}/blog/b3</loc>\\s*<lastmod>2026-03-03</lastmod>`));
    });

    it("SEO32: should escape special XML characters in blog URLs", async () => {
      blogsRepo.getBlogsForSitemap.mockResolvedValue([
        { slug: "blog&<>'\"", updatedAt: new Date() }
      ]);
      const xml = await seoService.generateBlogsSitemap(baseUrl);
      expect(xml).toContain(`${baseUrl}/blog/blog&amp;&lt;&gt;&apos;&quot;`);
    });

    it("SEO34: should propagate repository rejections", async () => {
      blogsRepo.getBlogsForSitemap.mockRejectedValue(new Error("DB Connection Lost"));
      await expect(seoService.generateBlogsSitemap(baseUrl)).rejects.toThrow("DB Connection Lost");
    });
  });
});