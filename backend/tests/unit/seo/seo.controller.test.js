import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as seoController from "../../../src/modules/seo/seo.controller.js";
import * as seoService from "../../../src/modules/seo/seo.service.js";

// Service mock to isolate controller
vi.mock("../../../src/modules/seo/seo.service.js");

describe("SEO Controller", () => {
  let req, res, next;
  let originalClientUrl;

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Save original env variable
    originalClientUrl = process.env.CLIENT_URL;

    req = {};
    
    res = {
      set: vi.fn().mockReturnThis(),
      header: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    
    next = vi.fn();
  });

  afterEach(() => {
    // Restore env variable after each test
    process.env.CLIENT_URL = originalClientUrl;
  });

  it("SEO-C01: should return robots.txt with 200, text/plain, and Cache-Control headers", async () => {
    process.env.CLIENT_URL = "https://example.com";
    seoService.generateRobotsTxt.mockReturnValue("robots-content");

    await seoController.getRobotsTxt(req, res, next);

    expect(seoService.generateRobotsTxt).toHaveBeenCalledWith("https://example.com");
    expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=3600");
    expect(res.header).toHaveBeenCalledWith("Content-Type", "text/plain");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("robots-content");
  });

  it("SEO-C02: should return sitemap index with 200, application/xml, and Cache-Control headers", async () => {
    process.env.CLIENT_URL = "https://example.com";
    seoService.generateSitemapIndex.mockReturnValue("<sitemapindex></sitemapindex>");

    await seoController.getSitemapIndex(req, res, next);

    expect(seoService.generateSitemapIndex).toHaveBeenCalledWith("https://example.com");
    expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=3600");
    expect(res.header).toHaveBeenCalledWith("Content-Type", "application/xml");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("<sitemapindex></sitemapindex>");
  });

  it("SEO-C03: should return pages sitemap with 200, application/xml, and Cache-Control headers", async () => {
    process.env.CLIENT_URL = "https://example.com";
    seoService.generatePagesSitemap.mockResolvedValue("<urlset>pages</urlset>");

    await seoController.getPagesSitemap(req, res, next);

    expect(seoService.generatePagesSitemap).toHaveBeenCalledWith("https://example.com");
    expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=3600");
    expect(res.header).toHaveBeenCalledWith("Content-Type", "application/xml");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("<urlset>pages</urlset>");
  });

  it("SEO-C04: should return blogs sitemap with 200, application/xml, and Cache-Control headers", async () => {
    process.env.CLIENT_URL = "https://example.com";
    seoService.generateBlogsSitemap.mockResolvedValue("<urlset>blogs</urlset>");

    await seoController.getBlogsSitemap(req, res, next);

    expect(seoService.generateBlogsSitemap).toHaveBeenCalledWith("https://example.com");
    expect(res.set).toHaveBeenCalledWith("Cache-Control", "public, max-age=3600");
    expect(res.header).toHaveBeenCalledWith("Content-Type", "application/xml");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("<urlset>blogs</urlset>");
  });

  it("SEO-C05: should use default URL fallback if CLIENT_URL is missing", async () => {
    delete process.env.CLIENT_URL;
    seoService.generateRobotsTxt.mockReturnValue("content");

    await seoController.getRobotsTxt(req, res, next);

    expect(seoService.generateRobotsTxt).toHaveBeenCalledWith("https://subhaakritee.vercel.app");
  });

  it("SEO-C06: should successfully remove trailing slash from CLIENT_URL", async () => {
    process.env.CLIENT_URL = "https://example.com/";
    seoService.generateRobotsTxt.mockReturnValue("content");

    await seoController.getRobotsTxt(req, res, next);

    expect(seoService.generateRobotsTxt).toHaveBeenCalledWith("https://example.com");
  });

  it("SEO-C07: should forward service errors to next()", async () => {
    const error = new Error("Sitemap Generation Failed");
    seoService.generatePagesSitemap.mockRejectedValue(error);

    await seoController.getPagesSitemap(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});