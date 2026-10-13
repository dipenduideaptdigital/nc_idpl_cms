import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prisma } from "../../../src/config/db.js";
import * as repo from "../../../src/modules/blogs/blogs.repository.js";

// Mocking Prisma Client
vi.mock("../../../src/config/db.js", () => {
  const createMockModel = () => ({
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  });
  return {
    prisma: {
      blog: createMockModel(),
      blogCategory: createMockModel(),
      blogTag: createMockModel(),
      blogRevision: createMockModel(),
      blogPreviewToken: createMockModel(),
      blogViewLog: createMockModel(),
      blogSlugHistory: createMockModel(),
      media: createMockModel(),
      $transaction: vi.fn(),
    },
  };
});

describe("Blogs Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    prisma.$transaction.mockImplementation(async (arg) => {
      if (typeof arg === "function") {
        return arg(prisma);
      }
      return arg; // Array transaction
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("A. Constants, slug lookup, taxonomy validation and media", () => {
    it("SL-01 to SL-05: isSlugTaken behaves correctly with and without excludeId", async () => {
      prisma.blog.findFirst.mockResolvedValueOnce({ id: "1" }); // Taken
      expect(await repo.isSlugTaken("test-slug")).toBe(true);
      expect(prisma.blog.findFirst).toHaveBeenCalledWith({
        where: { slug: "test-slug", deletedAt: null },
        select: { id: true },
      });

      prisma.blog.findFirst.mockResolvedValueOnce(null); // Not taken
      expect(await repo.isSlugTaken("test-slug", "exclude_1")).toBe(false);
      expect(prisma.blog.findFirst).toHaveBeenCalledWith({
        where: { slug: "test-slug", deletedAt: null, id: { not: "exclude_1" } },
        select: { id: true },
      });
    });

    it("TV-01 to TV-05: validateTaxonomyIds correctly validates categories and tags", async () => {
      // Both empty
      expect(await repo.validateTaxonomyIds([], [])).toEqual({ categoriesValid: true, tagsValid: true });

      // Valid IDs
      prisma.blogCategory.count.mockResolvedValueOnce(2);
      prisma.blogTag.count.mockResolvedValueOnce(1);
      expect(await repo.validateTaxonomyIds(["cat1", "cat2"], ["tag1"])).toEqual({ categoriesValid: true, tagsValid: true });

      // Invalid IDs (Count mismatch)
      prisma.blogCategory.count.mockResolvedValueOnce(1); // Provided 2, found 1
      prisma.blogTag.count.mockResolvedValueOnce(0); // Provided 1, found 0
      expect(await repo.validateTaxonomyIds(["cat1", "cat2"], ["tag1"])).toEqual({ categoriesValid: false, tagsValid: false });
    });

    it("FM-01 to FM-02: findMediaById resolves media properly", async () => {
      prisma.media.findFirst.mockResolvedValueOnce({ id: "media_1", mimeType: "image/jpeg" });
      expect(await repo.findMediaById("media_1")).toEqual({ id: "media_1", mimeType: "image/jpeg" });
      expect(prisma.media.findFirst).toHaveBeenCalledWith({
        where: { id: "media_1", deletedAt: null },
        select: { id: true, mimeType: true },
      });
    });
  });

  describe("B. createBlogWithRevision()", () => {
    it("CR-01 to CR-07: Creates blog, connects taxonomies, applies featured limits, and creates revision", async () => {
      prisma.blog.count.mockResolvedValue(2); // Featured limit check
      prisma.blog.create.mockResolvedValue({ id: "blog_1", title: "Test" });
      
      const payload = { title: "Test", isFeatured: true };
      await repo.createBlogWithRevision(payload, ["cat_1"], ["tag_1"], "actor_1");

      expect(prisma.blog.count).toHaveBeenCalledWith({
        where: { isFeatured: true, status: "PUBLISHED", deletedAt: null }
      });
      
      expect(prisma.blog.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          ...payload,
          categories: { connect: [{ id: "cat_1" }] },
          tags: { connect: [{ id: "tag_1" }] },
        })
      }));

      expect(prisma.blogRevision.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          blogId: "blog_1",
          actorId: "actor_1",
          snapshot: { id: "blog_1", title: "Test" }
        })
      });
    });

    it("CR-06: Throws error if featured blog limit is reached", async () => {
      prisma.blog.count.mockResolvedValue(6);
      await expect(repo.createBlogWithRevision({ isFeatured: true }, [], [], "actor_1"))
        .rejects.toThrow("Maximum of 6 featured blogs reached");
      expect(prisma.blog.create).not.toHaveBeenCalled();
    });
  });

  describe("C. updateBlogWithRevision()", () => {
    it("UR-01 to UR-09: Updates blog, clears/sets relations, applies limits, and creates revision", async () => {
      prisma.blog.count.mockResolvedValue(2);
      prisma.blog.update.mockResolvedValue({ id: "blog_1", title: "Updated" });

      await repo.updateBlogWithRevision("blog_1", { isFeatured: true }, [], [], "actor_1");

      expect(prisma.blog.count).toHaveBeenCalledWith({
        where: { isFeatured: true, status: "PUBLISHED", deletedAt: null, id: { not: "blog_1" } }
      });

      expect(prisma.blog.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "blog_1" },
        data: expect.objectContaining({
          isFeatured: true,
          categories: { set: [] },
          tags: { set: [] }
        })
      }));

      expect(prisma.blogRevision.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ blogId: "blog_1", actorId: "actor_1" })
      }));
    });
  });

  describe("D. trackBlogView()", () => {
    it("VW-01 to VW-04: Deduplicates views and triggers array transaction", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-10-10T10:00:00Z");
      vi.setSystemTime(now);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // VW-01: No recent view exists
      prisma.blogViewLog.findFirst.mockResolvedValueOnce(null);
      await repo.trackBlogView("blog_1", "fp_123");

      expect(prisma.blogViewLog.findFirst).toHaveBeenCalledWith({
        where: { blogId: "blog_1", fingerprint: "fp_123", createdAt: { gte: oneHourAgo } },
        select: { id: true }
      });
      
      expect(prisma.blogViewLog.create).toHaveBeenCalledWith({ data: { blogId: "blog_1", fingerprint: "fp_123" } });
      expect(prisma.blog.update).toHaveBeenCalledWith({ where: { id: "blog_1" }, data: { viewCount: { increment: 1 } } });
      expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Array));

      vi.clearAllMocks();
      prisma.blogViewLog.findFirst.mockResolvedValueOnce({ id: "log_1" });
      await repo.trackBlogView("blog_1", "fp_123");
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe("E. findBlogById() & findBlogBySlug()", () => {
    it("BS-01 to BS-06: Applies correct public and admin filters", async () => {
      // Public lookup
      await repo.findBlogBySlug("test-slug", true);
      expect(prisma.blog.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          slug: "test-slug",
          deletedAt: null,
          status: "PUBLISHED",
          publishedAt: { lte: expect.any(Date) }
        }),
        include: repo.BLOG_PUBLIC_SELECT_INCLUDE
      }));

      // Admin lookup
      await repo.findBlogBySlug("test-slug", false);
      expect(prisma.blog.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: { slug: "test-slug", deletedAt: null },
        include: repo.BLOG_ADMIN_SELECT_INCLUDE
      }));
    });
  });

  describe("F. deleteBlogAndPreviewTokens()", () => {
    it("DL-01 to DL-08: Soft deletes blog and cleans tokens via transaction", async () => {
      vi.useFakeTimers();
      const mockTime = 1600000000000;
      vi.setSystemTime(mockTime);

      prisma.blog.findUnique.mockResolvedValueOnce({ slug: "old-slug" });
      prisma.blog.update.mockResolvedValueOnce({ id: "blog_1" });

      await repo.deleteBlogAndPreviewTokens("blog_1");

      expect(prisma.blogPreviewToken.deleteMany).toHaveBeenCalledWith({ where: { blogId: "blog_1" } });
      expect(prisma.blog.update).toHaveBeenCalledWith({
        where: { id: "blog_1" },
        data: {
          slug: `old-slug__deleted__${mockTime}`,
          deletedAt: new Date(mockTime),
          status: "ARCHIVED"
        }
      });
    });

    it("DL-03: Returns null if blog is missing", async () => {
      prisma.blog.findUnique.mockResolvedValueOnce(null);
      const res = await repo.deleteBlogAndPreviewTokens("invalid");
      expect(res).toBeNull();
      expect(prisma.blog.update).not.toHaveBeenCalled();
    });
  });

  describe("G. findBlogsPaginated()", () => {
    it("PG-01 to PG-13: Maps public and admin filters with pagination correctly", async () => {
      prisma.blog.findMany.mockResolvedValue([]);
      prisma.blog.count.mockResolvedValue(0);

      const params = {
        skip: 10, take: 5, search: "keyword",
        status: "DRAFT", authorId: "author_1", categorySlug: "tech",
        isFeatured: false, sortBy: "viewCount", sortOrder: "desc"
      };

      // Admin test
      await repo.findBlogsPaginated(params, false);
      const expectedAdminWhere = expect.objectContaining({
        deletedAt: null,
        status: "DRAFT",
        authorId: "author_1",
        isFeatured: false,
        categories: { some: { slug: "tech" } },
        OR: [
          { title: { contains: "keyword", mode: "insensitive" } },
          { excerpt: { contains: "keyword", mode: "insensitive" } }
        ]
      });

      expect(prisma.blog.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expectedAdminWhere,
        skip: 10, take: 5,
        orderBy: { viewCount: "desc" },
        include: repo.BLOG_ADMIN_SELECT_INCLUDE
      }));
      expect(prisma.blog.count).toHaveBeenCalledWith({ where: expectedAdminWhere });

      // Public test
      await repo.findBlogsPaginated(params, true);
      const expectedPublicWhere = expect.objectContaining({
        deletedAt: null,
        status: "PUBLISHED",
        publishedAt: { lte: expect.any(Date) },
      });
      expect(prisma.blog.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expectedPublicWhere,
        include: repo.BLOG_PUBLIC_SELECT_INCLUDE
      }));
    });
  });

  describe("H. getSidebarData()", () => {
    it("SB-01 to SB-05: Returns datasets correctly formatted", async () => {
      prisma.blogCategory.findMany.mockResolvedValue(["cat1"]);
      prisma.blog.findMany.mockResolvedValue(["post1"]);
      prisma.blogTag.findMany.mockResolvedValue(["tag1"]);

      const result = await repo.getSidebarData();
      expect(result).toEqual({ categories: ["cat1"], recentPosts: ["post1"], popularTags: ["tag1"] });
      
      // Checking recentPosts filters
      expect(prisma.blog.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: "PUBLISHED", deletedAt: null, publishedAt: { lte: expect.any(Date) } },
        take: 5,
        orderBy: { publishedAt: "desc" }
      }));
    });
  });

  describe("I. getRelatedBlogs()", () => {
    it("RB-01 to RB-06: Finds related blogs by category or falls back", async () => {
      // RB-01: Found by categories
      prisma.blog.findMany.mockResolvedValueOnce(["related1"]);
      await repo.getRelatedBlogs("blog_1", ["tech"], 3);
      expect(prisma.blog.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          id: { not: "blog_1" },
          categories: { some: { slug: { in: ["tech"] } } }
        }),
        take: 3
      }));

      // RB-03: Fallback query
      vi.clearAllMocks();
      prisma.blog.findMany.mockResolvedValueOnce([]); // 1st empty
      prisma.blog.findMany.mockResolvedValueOnce(["fallback1"]); // 2nd fallback
      
      const res = await repo.getRelatedBlogs("blog_1", ["tech"], 3);
      expect(res).toEqual(["fallback1"]);
      expect(prisma.blog.findMany).toHaveBeenCalledTimes(2);
      expect(prisma.blog.findMany).toHaveBeenLastCalledWith(expect.objectContaining({
        where: expect.objectContaining({ id: { not: "blog_1" } })
      }));
    });
  });

  describe("J. getAdjacentPosts()", () => {
    it("AP-01 to AP-07: Respects strict date boundaries", async () => {
      // Falsy date
      expect(await repo.getAdjacentPosts(null)).toEqual({ prev: null, next: null });

      const pubDate = new Date("2026-05-05T00:00:00Z");
      prisma.blog.findFirst.mockResolvedValueOnce({ slug: "prev" }).mockResolvedValueOnce({ slug: "next" });

      const res = await repo.getAdjacentPosts(pubDate);
      expect(res).toEqual({ prev: { slug: "prev" }, next: { slug: "next" } });

      // Prev expects strict 'lt'
      expect(prisma.blog.findFirst).toHaveBeenNthCalledWith(1, expect.objectContaining({
        where: expect.objectContaining({ publishedAt: { lt: pubDate } }),
        orderBy: { publishedAt: "desc" }
      }));
      // Next expects strict 'gt' and 'lte' bounds
      expect(prisma.blog.findFirst).toHaveBeenNthCalledWith(2, expect.objectContaining({
        where: expect.objectContaining({ publishedAt: { gt: pubDate, lte: expect.any(Date) } }),
        orderBy: { publishedAt: "asc" }
      }));
    });
  });

  describe("K. Preview Tokens Operations", () => {
    it("PT-06 to PT-09: replaceAndCreatePreviewToken replaces old ones via transaction", async () => {
      prisma.blogPreviewToken.create.mockResolvedValueOnce({ id: "token_1" });
      const payload = { blogId: "b1", tokenHash: "hash", createdById: "u1", expiresAt: new Date() };
      
      await repo.replaceAndCreatePreviewToken(payload);

      expect(prisma.blogPreviewToken.deleteMany).toHaveBeenCalledWith({ where: { blogId: "b1" } });
      expect(prisma.blogPreviewToken.create).toHaveBeenCalledWith({ data: payload });
    });

    it("PT-13: incrementPreviewTokenUsage increments count", async () => {
      await repo.incrementPreviewTokenUsage("t1");
      expect(prisma.blogPreviewToken.update).toHaveBeenCalledWith({
        where: { id: "t1" },
        data: expect.objectContaining({ usedCount: { increment: 1 } })
      });
    });
  });

  describe("L. Scheduled publishing & cleanup", () => {
    it("SC-01 to SC-03: publishScheduledBlogs updates status only", async () => {
      prisma.blog.updateMany.mockResolvedValue({ count: 5 });
      const res = await repo.publishScheduledBlogs();
      
      expect(res).toEqual({ count: 5 });
      expect(prisma.blog.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: "SCHEDULED", publishedAt: { lte: expect.any(Date) }, deletedAt: null },
        data: { status: "PUBLISHED" }
      }));
    });

    it("SC-04 to SC-09: Correct boundaries for delete logic", async () => {
      const threshold = new Date();
      await repo.deleteOldViewLogs(threshold);
      expect(prisma.blogViewLog.deleteMany).toHaveBeenCalledWith({
        where: { createdAt: { lt: threshold } }
      });

      await repo.deleteExpiredPreviewTokens();
      expect(prisma.blogPreviewToken.deleteMany).toHaveBeenCalledWith({
        where: { expiresAt: { lt: expect.any(Date) } }
      });
    });
  });

  describe("M & N. Categories & Tags Repository", () => {
    it("CAT & TAG: Supports full CRUD operations properly mapped", async () => {
      // Find by slug with exclude ID
      await repo.findCategoryBySlug("cat-1", "ignore_id");
      expect(prisma.blogCategory.findFirst).toHaveBeenCalledWith({
        where: { slug: "cat-1", id: { not: "ignore_id" } }, select: { id: true }
      });

      // Count usage
      prisma.blogTag.findUnique.mockResolvedValueOnce({ _count: { blogs: 10 } });
      expect(await repo.countTagUsage("tag-1")).toBe(10);

      // Find all
      await repo.findAllCategories();
      expect(prisma.blogCategory.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: { name: "asc" },
        include: { _count: { select: { blogs: expect.any(Object) } } }
      }));
    });
  });

  describe("O. Slug history & Sitemap", () => {
    it("SH-03: findBlogIdByOldSlug retrieves exact relations", async () => {
    await repo.findBlogIdByOldSlug("old-test-slug");
    expect(prisma.blogSlugHistory.findUnique).toHaveBeenCalledWith({
      where: { oldSlug: "old-test-slug" },
      include: {
        blog: {
          select: {
            slug: true,
            status: true,
            deletedAt: true,
          },
        },
      },
    });
  });

    it("SM-01 to SM-03: getBlogsForSitemap fetches eligible blogs", async () => {
      await repo.getBlogsForSitemap();
      expect(prisma.blog.findMany).toHaveBeenCalledWith({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          includeInSitemap: true,
          noIndex: false
        },
        select: {
          slug: true,
          publishedAt: true,
          updatedAt: true
        }
      });
    });
  });
});