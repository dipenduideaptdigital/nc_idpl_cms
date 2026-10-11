import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as blogService from "../../../src/modules/blogs/blogs.service.js";
import * as repo from "../../../src/modules/blogs/blogs.repository.js";
import { prisma } from "../../../src/config/db.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mocking dependencies
vi.mock("../../../src/modules/blogs/blogs.repository.js");
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    blogCategory: { findUnique: vi.fn() },
    blogTag: { findUnique: vi.fn() },
  }
}));

describe("Blogs Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createBlog()", () => {
    const validPayload = {
      title: "My First Blog",
      content: { blocks: ["Some plaintext content"] },
      status: "DRAFT",
      categoryIds: [],
      tagIds: []
    };

    beforeEach(() => {
      // Setup default successful mocks
      repo.validateTaxonomyIds.mockResolvedValue({ categoriesValid: true, tagsValid: true });
      repo.isSlugTaken.mockResolvedValue(false);
      repo.findMediaById.mockResolvedValue({ mimeType: "image/jpeg" });
      repo.createBlogWithRevision.mockResolvedValue({ id: "blog-123" });
    });

    it("CB-01: should create a valid draft blog with correct default fields", async () => {
      await blogService.createBlog(validPayload, "author_1");
      
      expect(repo.createBlogWithRevision).toHaveBeenCalledTimes(1);
      expect(repo.createBlogWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My First Blog",
          slug: "my-first-blog",
          readingTime: 1, 
          viewCount: 0,
          authorId: "author_1",
          publishedAt: null
        }),
        [], // categoryIds
        [], // tagIds
        "author_1"
      );
    });

    it("CB-02: should throw 400 AppError if category ID does not exist", async () => {
      repo.validateTaxonomyIds.mockResolvedValue({ categoriesValid: false, tagsValid: true });
      
      await expect(blogService.createBlog(validPayload, "author_1")).rejects.toThrow(AppError);
      expect(repo.createBlogWithRevision).not.toHaveBeenCalled();
    });

    it("CB-03: should throw 400 AppError if tag ID does not exist", async () => {
      repo.validateTaxonomyIds.mockResolvedValue({ categoriesValid: true, tagsValid: false });
      
      await expect(blogService.createBlog(validPayload, "author_1")).rejects.toThrow(AppError);
      expect(repo.createBlogWithRevision).not.toHaveBeenCalled();
    });

    it("CB-04: should throw 400 AppError if SCHEDULED status lacks publishedAt", async () => {
      const payload = { ...validPayload, status: "SCHEDULED", publishedAt: null };
      await expect(blogService.createBlog(payload, "author_1")).rejects.toThrow(AppError);
    });

    it("CB-05: should throw 400 AppError if scheduled date is invalid or in the past", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-10T10:00:00Z"));
      
      const pastPayload = { ...validPayload, status: "SCHEDULED", publishedAt: "2026-10-09T10:00:00Z" };
      await expect(blogService.createBlog(pastPayload, "author_1")).rejects.toThrow(AppError);

      const invalidPayload = { ...validPayload, status: "SCHEDULED", publishedAt: "not-a-valid-date" };
      await expect(blogService.createBlog(invalidPayload, "author_1")).rejects.toThrow(AppError);
    });

    it("CB-06: should throw 400 AppError if featured image ID does not exist", async () => {
      repo.findMediaById.mockResolvedValue(null);
      const payload = { ...validPayload, featuredImageId: "fake-img-id" };
      
      await expect(blogService.createBlog(payload, "author_1")).rejects.toThrow(AppError);
      expect(repo.createBlogWithRevision).not.toHaveBeenCalled();
    });

    it("CB-07: should throw 400 AppError if featured image is not an image MIME type", async () => {
      repo.findMediaById.mockResolvedValue({ mimeType: "video/mp4" });
      const payload = { ...validPayload, featuredImageId: "video-id" };
      
      await expect(blogService.createBlog(payload, "author_1")).rejects.toThrow(AppError);
      expect(repo.createBlogWithRevision).not.toHaveBeenCalled();
    });

    it("CB-08: should generate next available slug if original is already taken", async () => {
      // First check returns true (taken), second check returns false (available)
      repo.isSlugTaken.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      
      await blogService.createBlog(validPayload, "author_1");
      
      expect(repo.isSlugTaken).toHaveBeenCalledTimes(2);
      expect(repo.createBlogWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "my-first-blog-1" }),
        [], [], "author_1"
      );
    });

    it("CB-09: should set publishedAt to current time when status is PUBLISHED", async () => {
      vi.useFakeTimers();
      const mockNow = new Date("2026-10-10T10:00:00Z");
      vi.setSystemTime(mockNow);
      
      const payload = { ...validPayload, status: "PUBLISHED" };
      await blogService.createBlog(payload, "author_1");
      
      expect(repo.createBlogWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ publishedAt: mockNow }),
        [], [], "author_1"
      );
    });

    it("CB-10: should set publishedAt to null when status is DRAFT", async () => {
      const payload = { ...validPayload, status: "DRAFT", publishedAt: "2026-12-12T10:00:00Z" };
      await blogService.createBlog(payload, "author_1");
      
      expect(repo.createBlogWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ publishedAt: null }),
        [], [], "author_1"
      );
    });

    it("CB-11: should default readingTime to 1 if content is empty or missing", async () => {
      const payload = { ...validPayload, content: null };
      await blogService.createBlog(payload, "author_1");
      
      expect(repo.createBlogWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ readingTime: 1 }),
        [], [], "author_1"
      );
    });

    it("CB-12: should throw 409 AppError if repository creation fails", async () => {
      repo.createBlogWithRevision.mockRejectedValue(new Error("Database write failed"));
      
      await expect(blogService.createBlog(validPayload, "author_1")).rejects.toThrow(AppError);

    });

  // updateBlog()
  describe("updateBlog()", () => {
    const existingBlog = {
      id: "blog-123",
      title: "Original Blog",
      slug: "original-blog",
      authorId: "author_1",
      status: "DRAFT",
      publishedAt: null,
      content: { blocks: ["Original content"] },
    };

    beforeEach(() => {
      repo.findBlogById.mockResolvedValue({ ...existingBlog });
      repo.validateTaxonomyIds.mockResolvedValue({
        categoriesValid: true,
        tagsValid: true,
      });
      repo.findMediaById.mockResolvedValue({ mimeType: "image/jpeg" });
      repo.isSlugTaken.mockResolvedValue(false);
      repo.createBlogSlugHistory.mockResolvedValue({});
      repo.updateBlogWithRevision.mockResolvedValue({ id: "blog-123" });
    });

    it("UB-01: should throw 404 when the blog does not exist", async () => {
      repo.findBlogById.mockResolvedValue(null);

      await expect(
        blogService.updateBlog("missing", { title: "Updated" }, "author_1")
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(repo.updateBlogWithRevision).not.toHaveBeenCalled();
    });

    it("UB-02: should reject edits by another author", async () => {
      await expect(
        blogService.updateBlog(
          "blog-123",
          { title: "Updated" },
          "author_2",
          "EDITOR",
          []
        )
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(repo.updateBlogWithRevision).not.toHaveBeenCalled();
    });

    it("UB-03: should allow SUPER_ADMIN to edit another author's blog", async () => {
      await blogService.updateBlog(
        "blog-123",
        { excerpt: "Updated excerpt" },
        "admin_1",
        "SUPER_ADMIN",
        []
      );

      expect(repo.updateBlogWithRevision).toHaveBeenCalled();
    });

    it("UB-04: should allow an actor with blog.edit permission", async () => {
      await blogService.updateBlog(
        "blog-123",
        { excerpt: "Updated excerpt" },
        "editor_1",
        "EDITOR",
        ["blog.edit"]
      );

      expect(repo.updateBlogWithRevision).toHaveBeenCalled();
    });

    it("UB-05: should only pass allowed scalar fields to the repository", async () => {
      await blogService.updateBlog(
        "blog-123",
        {
          excerpt: "New excerpt",
          authorId: "attacker",
          viewCount: 999,
          unknownField: "should not be saved",
        },
        "author_1",
        "AUTHOR"
      );

      const updateData = repo.updateBlogWithRevision.mock.calls[0][1];

      expect(updateData.excerpt).toBe("New excerpt");
      expect(updateData).not.toHaveProperty("authorId");
      expect(updateData).not.toHaveProperty("viewCount");
      expect(updateData).not.toHaveProperty("unknownField");
    });

    it("UB-06: should reject invalid taxonomy IDs", async () => {
      repo.validateTaxonomyIds.mockResolvedValue({
        categoriesValid: false,
        tagsValid: true,
      });

      await expect(
        blogService.updateBlog(
          "blog-123",
          { categoryIds: ["invalid-category"] },
          "author_1"
        )
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(repo.updateBlogWithRevision).not.toHaveBeenCalled();
    });

    it("UB-07: should reject a non-image featured asset", async () => {
      repo.findMediaById.mockResolvedValue({ mimeType: "video/mp4" });

      await expect(
        blogService.updateBlog(
          "blog-123",
          { featuredImageId: "media-1" },
          "author_1"
        )
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(repo.updateBlogWithRevision).not.toHaveBeenCalled();
    });

    it("UB-08: should regenerate the slug when an unpublished blog title changes", async () => {
      await blogService.updateBlog(
        "blog-123",
        { title: "A New Blog Title" },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1].slug)
        .toBe("a-new-blog-title");
    });

    it("UB-09: should not automatically regenerate the slug for a published blog title change", async () => {
      repo.findBlogById.mockResolvedValue({
        ...existingBlog,
        status: "PUBLISHED",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
      });

      await blogService.updateBlog(
        "blog-123",
        { title: "Renamed Published Blog" },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1])
        .not.toHaveProperty("slug");
    });

    it("UB-10: should create slug history when changing a published blog slug", async () => {
      repo.findBlogById.mockResolvedValue({
        ...existingBlog,
        status: "PUBLISHED",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
      });

      await blogService.updateBlog(
        "blog-123",
        { slug: "new-published-slug" },
        "author_1"
      );

      expect(repo.createBlogSlugHistory)
        .toHaveBeenCalledWith("blog-123", "original-blog");

      expect(repo.updateBlogWithRevision.mock.calls[0][1].slug)
        .toBe("new-published-slug");
    });

    it("UB-11: should continue updating if slug-history creation fails", async () => {
      repo.findBlogById.mockResolvedValue({
        ...existingBlog,
        status: "PUBLISHED",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
      });

      repo.createBlogSlugHistory.mockRejectedValue(
        new Error("History storage unavailable")
      );

      await expect(
        blogService.updateBlog(
          "blog-123",
          { slug: "new-published-slug" },
          "author_1"
        )
      ).resolves.toEqual({ id: "blog-123" });

      expect(repo.updateBlogWithRevision).toHaveBeenCalled();
    });

    it("UB-12: should preserve the scheduled publication date when publishing a scheduled blog", async () => {
      const scheduledDate = new Date("2026-12-20T10:00:00Z");

      repo.findBlogById.mockResolvedValue({
        ...existingBlog,
        status: "SCHEDULED",
        publishedAt: scheduledDate,
      });

      await blogService.updateBlog(
        "blog-123",
        { status: "PUBLISHED" },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1].publishedAt)
        .toEqual(scheduledDate);
    });

    it("UB-13: should set publication time when a draft becomes published", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-10-10T10:00:00Z");
      vi.setSystemTime(now);

      await blogService.updateBlog(
        "blog-123",
        { status: "PUBLISHED" },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1].publishedAt)
        .toEqual(now);
    });

    it("UB-14: should preserve the original publication date on an ordinary published-blog update", async () => {
      const publishedDate = new Date("2026-01-01T00:00:00Z");

      repo.findBlogById.mockResolvedValue({
        ...existingBlog,
        status: "PUBLISHED",
        publishedAt: publishedDate,
      });

      await blogService.updateBlog(
        "blog-123",
        { excerpt: "Updated excerpt" },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1].publishedAt)
        .toEqual(publishedDate);
    });

    it("UB-15: should recalculate reading time when content changes", async () => {
      const words = Array(201).fill("word").join(" ");

      await blogService.updateBlog(
        "blog-123",
        { content: { blocks: [words] } },
        "author_1"
      );

      expect(repo.updateBlogWithRevision.mock.calls[0][1].readingTime)
        .toBe(2);
    });

    it("UB-16: should convert repository update errors to 409 AppError", async () => {
      repo.updateBlogWithRevision.mockRejectedValue(
        new Error("Database update failed")
      );

      await expect(
        blogService.updateBlog(
          "blog-123",
          { excerpt: "Updated" },
          "author_1"
        )
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  // Listing and secure blog retrieval
  describe("blog listing and retrieval", () => {
    beforeEach(() => {
      repo.findBlogsPaginated.mockResolvedValue({
        records: [{ id: "blog-1" }, { id: "blog-2" }],
        total: 12,
      });
    });

    it("LIST-01: should calculate public pagination metadata correctly", async () => {
      const result = await blogService.getPublicBlogs({
        page: 2,
        limit: 5,
        status: "PUBLISHED",
      });

      expect(repo.findBlogsPaginated).toHaveBeenCalledWith(
        { skip: 5, take: 5, status: "PUBLISHED" },
        true
      );

      expect(result).toEqual({
        data: [{ id: "blog-1" }, { id: "blog-2" }],
        meta: { total: 12, page: 2, limit: 5, totalPages: 3 },
      });
    });

    it("LIST-02: should restrict ordinary admin listings to the actor's own blogs", async () => {
      await blogService.getAdminBlogs(
        { page: 1, limit: 10, status: "DRAFT" },
        "author_1",
        "EDITOR",
        []
      );

      expect(repo.findBlogsPaginated).toHaveBeenCalledWith(
        {
          skip: 0,
          take: 10,
          status: "DRAFT",
          authorId: "author_1",
        },
        false
      );
    });

    it("LIST-03: should not add an author restriction for SUPER_ADMIN", async () => {
      await blogService.getAdminBlogs(
        { page: 1, limit: 10 },
        "admin_1",
        "SUPER_ADMIN",
        []
      );

      expect(repo.findBlogsPaginated).toHaveBeenCalledWith(
        { skip: 0, take: 10 },
        false
      );
    });

    it("LIST-04: should not add an author restriction when actor has blog.edit", async () => {
      await blogService.getAdminBlogs(
        { page: 1, limit: 10 },
        "editor_1",
        "EDITOR",
        ["blog.edit"]
      );

      expect(repo.findBlogsPaginated).toHaveBeenCalledWith(
        { skip: 0, take: 10 },
        false
      );
    });

    it("LIST-05: should throw 404 when secure blog retrieval cannot find a blog", async () => {
      repo.findBlogById.mockResolvedValue(null);

      await expect(
        blogService.getAdminBlogByIdSecure(
          "missing",
          "author_1",
          "AUTHOR",
          []
        )
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("LIST-06: should reject secure retrieval by a different author", async () => {
      repo.findBlogById.mockResolvedValue({
        id: "blog-1",
        authorId: "author_2",
      });

      await expect(
        blogService.getAdminBlogByIdSecure(
          "blog-1",
          "author_1",
          "AUTHOR",
          []
        )
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it("LIST-07: should return a blog when its owner requests it", async () => {
      const blog = { id: "blog-1", authorId: "author_1" };
      repo.findBlogById.mockResolvedValue(blog);

      await expect(
        blogService.getAdminBlogByIdSecure(
          "blog-1",
          "author_1",
          "AUTHOR",
          []
        )
      ).resolves.toEqual(blog);
    });

    it("LIST-08: should return public blog details and related content", async () => {
      const blog = {
        id: "blog-1",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
        categories: [{ slug: "news" }],
      };

      repo.findBlogBySlug.mockResolvedValue(blog);
      repo.trackBlogView.mockResolvedValue(undefined);
      repo.getRelatedBlogs.mockResolvedValue([{ id: "related-1" }]);
      repo.getAdjacentPosts.mockResolvedValue({ next: null, previous: null });
      repo.getSidebarData.mockResolvedValue({ popular: [] });

      const result = await blogService.getBlogBySlug(
        "my-blog",
        "fingerprint-1"
      );

      expect(repo.findBlogBySlug).toHaveBeenCalledWith("my-blog", true);
      expect(repo.trackBlogView).toHaveBeenCalledWith(
        "blog-1",
        "fingerprint-1"
      );
      expect(repo.getRelatedBlogs).toHaveBeenCalledWith(
        "blog-1",
        ["news"],
        3
      );
      expect(result).toEqual({
        blog,
        relatedPosts: [{ id: "related-1" }],
        navigationSiblings: { next: null, previous: null },
        sidebar: { popular: [] },
      });
    });

    it("LIST-09: should throw 404 when a public slug is unavailable", async () => {
      repo.findBlogBySlug.mockResolvedValue(null);

      await expect(
        blogService.getBlogBySlug("missing-blog", "fingerprint-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("LIST-10: should still return blog details when view tracking fails", async () => {
      const blog = {
        id: "blog-1",
        publishedAt: new Date("2026-01-01T00:00:00Z"),
        categories: [],
      };

      repo.findBlogBySlug.mockResolvedValue(blog);
      repo.trackBlogView.mockRejectedValue(new Error("Tracking failed"));
      repo.getRelatedBlogs.mockResolvedValue([]);
      repo.getAdjacentPosts.mockResolvedValue({});
      repo.getSidebarData.mockResolvedValue({});

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      try {
        const result = await blogService.getBlogBySlug(
          "my-blog",
          "fingerprint-1"
        );
        expect(result.blog).toEqual(blog);
      } finally {
        consoleSpy.mockRestore();
      }
    });

    it("LIST-11: should reject deletion when the blog does not exist", async () => {
      repo.findBlogById.mockResolvedValue(null);

      await expect(
        blogService.deleteBlog("missing", "author_1", "AUTHOR", [])
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(repo.deleteBlogAndPreviewTokens).not.toHaveBeenCalled();
    });

    it("LIST-12: should reject deletion by a different author", async () => {
      repo.findBlogById.mockResolvedValue({
        id: "blog-1",
        authorId: "author_2",
      });

      await expect(
        blogService.deleteBlog("blog-1", "author_1", "AUTHOR", [])
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(repo.deleteBlogAndPreviewTokens).not.toHaveBeenCalled();
    });

    it("LIST-13: should delete the blog and its preview tokens for the owner", async () => {
      repo.findBlogById.mockResolvedValue({
        id: "blog-1",
        authorId: "author_1",
      });
      repo.deleteBlogAndPreviewTokens.mockResolvedValue({ id: "blog-1" });

      await expect(
        blogService.deleteBlog("blog-1", "author_1", "AUTHOR", [])
      ).resolves.toEqual({ id: "blog-1" });

      expect(repo.deleteBlogAndPreviewTokens)
        .toHaveBeenCalledWith("blog-1");
    });
  });

  // Preview links and tokens
  describe("blog preview lifecycle", () => {
    beforeEach(() => {
      repo.findBlogById.mockResolvedValue({
        id: "blog-1",
        authorId: "author_1",
        deletedAt: null,
      });
      repo.replaceAndCreatePreviewToken.mockResolvedValue({});
      repo.revokePreviewToken.mockResolvedValue({ success: true });
      repo.incrementPreviewTokenUsage.mockResolvedValue(undefined);
    });

    it("PV-01: should return inactive when no preview statistics exist", async () => {
      repo.getBlogPreviewTokenStats.mockResolvedValue(null);

      await expect(
        blogService.getBlogPreviewStatus("blog-1")
      ).resolves.toEqual({ isActive: false });
    });

    it("PV-02: should return expired status for an expired preview link", async () => {
      repo.getBlogPreviewTokenStats.mockResolvedValue({
        expiresAt: new Date("2020-01-01T00:00:00Z"),
      });

      await expect(
        blogService.getBlogPreviewStatus("blog-1")
      ).resolves.toEqual({ isActive: false, isExpired: true });
    });

    it("PV-03: should return metadata for an active preview link", async () => {
      const stats = {
        expiresAt: new Date("2099-01-01T00:00:00Z"),
        usedCount: 4,
        lastAccessedAt: new Date("2026-10-01T00:00:00Z"),
        createdAt: new Date("2026-09-30T00:00:00Z"),
      };
      repo.getBlogPreviewTokenStats.mockResolvedValue(stats);

      await expect(
        blogService.getBlogPreviewStatus("blog-1")
      ).resolves.toEqual({ isActive: true, ...stats });
    });

    it("PV-04: should reject preview-link generation for a missing blog", async () => {
      repo.findBlogById.mockResolvedValue(null);

      await expect(
        blogService.generatePreviewLink(
          "missing",
          "author_1",
          "AUTHOR",
          [],
          "https://example.com"
        )
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("PV-05: should reject preview-link generation by a different author", async () => {
      repo.findBlogById.mockResolvedValue({
        id: "blog-1",
        authorId: "author_2",
      });

      await expect(
        blogService.generatePreviewLink(
          "blog-1",
          "author_1",
          "AUTHOR",
          [],
          "https://example.com"
        )
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(repo.replaceAndCreatePreviewToken).not.toHaveBeenCalled();
    });

    it("PV-06: should store a hash and return a raw-token preview URL", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-10T10:00:00Z"));

      const result = await blogService.generatePreviewLink(
        "blog-1",
        "author_1",
        "AUTHOR",
        [],
        "https://example.com"
      );

      expect(result.previewUrl).toMatch(
        /^https:\/\/example\.com\/preview\/[a-f0-9]{64}\?type=blog$/
      );

      const rawToken = result.previewUrl.match(
        /\/preview\/([a-f0-9]{64})\?type=blog$/
      )[1];

      const storedToken = repo.replaceAndCreatePreviewToken.mock.calls[0][0];

      expect(storedToken.tokenHash).toMatch(/^[a-f0-9]{64}$/);
      expect(storedToken.tokenHash).not.toBe(rawToken);
      expect(storedToken).toMatchObject({
        blogId: "blog-1",
        createdById: "author_1",
      });
      expect(storedToken.expiresAt)
        .toEqual(new Date("2026-10-11T10:00:00Z"));
    });

    it("PV-07: should revoke a preview link for the owner", async () => {
      repo.revokePreviewToken.mockResolvedValue({ count: 1 });

      await expect(
        blogService.revokePreviewLink(
          "blog-1",
          "author_1",
          "AUTHOR",
          []
        )
      ).resolves.toEqual({ count: 1 });

      expect(repo.revokePreviewToken).toHaveBeenCalledWith("blog-1");
    });

    it("PV-08: should reject revocation for a missing blog", async () => {
      repo.findBlogById.mockResolvedValue(null);

      await expect(
        blogService.revokePreviewLink(
          "missing",
          "author_1",
          "AUTHOR",
          []
        )
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("PV-09: should reject an unknown preview token", async () => {
      repo.findPreviewTokenWithBlog.mockResolvedValue(null);

      await expect(
        blogService.resolvePreviewToken("unknown-token")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("PV-10: should reject an expired preview token with 410", async () => {
      repo.findPreviewTokenWithBlog.mockResolvedValue({
        id: "token-1",
        expiresAt: new Date("2020-01-01T00:00:00Z"),
        blog: { id: "blog-1", deletedAt: null },
      });

      await expect(
        blogService.resolvePreviewToken("expired-token")
      ).rejects.toMatchObject({ statusCode: 410 });
    });

    it("PV-11: should reject a preview token for a deleted blog", async () => {
      repo.findPreviewTokenWithBlog.mockResolvedValue({
        id: "token-1",
        expiresAt: new Date("2099-01-01T00:00:00Z"),
        blog: { id: "blog-1", deletedAt: new Date() },
      });

      await expect(
        blogService.resolvePreviewToken("deleted-blog-token")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("PV-12: should resolve a valid token and trigger usage tracking", async () => {
      const expiresAt = new Date("2099-01-01T00:00:00Z");
      const blog = { id: "blog-1", deletedAt: null };

      repo.findPreviewTokenWithBlog.mockResolvedValue({
        id: "token-1",
        expiresAt,
        blog,
      });

      const result = await blogService.resolvePreviewToken("valid-token");

      expect(result).toEqual({
        preview: { enabled: true, expiresAt },
        blog,
      });
      expect(repo.incrementPreviewTokenUsage)
        .toHaveBeenCalledWith("token-1");
    });

    it("PV-13: should still resolve a token when usage tracking fails", async () => {
      repo.findPreviewTokenWithBlog.mockResolvedValue({
        id: "token-1",
        expiresAt: new Date("2099-01-01T00:00:00Z"),
        blog: { id: "blog-1", deletedAt: null },
      });
      repo.incrementPreviewTokenUsage.mockRejectedValue(
        new Error("Usage update failed")
      );

      await expect(
        blogService.resolvePreviewToken("valid-token")
      ).resolves.toMatchObject({
        preview: { enabled: true },
        blog: { id: "blog-1" },
      });
    });
  });

  // Categories and tags
  describe("category management", () => {
    it("CAT-01: should create a category with a generated slug", async () => {
      prisma.blogCategory.findUnique.mockResolvedValue(null);
      repo.createCategory.mockResolvedValue({
        id: "cat-1",
        name: "Fish Care",
        slug: "fish-care",
      });

      await blogService.createCategory({ name: "Fish Care" });

      expect(prisma.blogCategory.findUnique).toHaveBeenCalledWith({
        where: { slug: "fish-care" },
      });
      expect(repo.createCategory).toHaveBeenCalledWith({
        name: "Fish Care",
        slug: "fish-care",
      });
    });

    it("CAT-02: should reject duplicate category names", async () => {
      prisma.blogCategory.findUnique.mockResolvedValue({ id: "existing" });

      await expect(
        blogService.createCategory({ name: "Fish Care" })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.createCategory).not.toHaveBeenCalled();
    });

    it("CAT-03: should update a category with its generated slug", async () => {
      repo.findCategoryBySlug.mockResolvedValue(null);
      repo.updateCategoryRecordNode.mockResolvedValue({ id: "cat-1" });

      await blogService.updateCategory("cat-1", { name: "Fish Health" });

      expect(repo.findCategoryBySlug)
        .toHaveBeenCalledWith("fish-health", "cat-1");
      expect(repo.updateCategoryRecordNode).toHaveBeenCalledWith(
        "cat-1",
        { name: "Fish Health", slug: "fish-health" }
      );
    });

    it("CAT-04: should reject a duplicate category slug during update", async () => {
      repo.findCategoryBySlug.mockResolvedValue({ id: "cat-2" });

      await expect(
        blogService.updateCategory("cat-1", { name: "Fish Health" })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.updateCategoryRecordNode).not.toHaveBeenCalled();
    });

    it("CAT-05: should reject deletion of a missing category", async () => {
      repo.findCategoryById.mockResolvedValue(null);

      await expect(
        blogService.deleteCategory("missing")
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(repo.countCategoryUsage).not.toHaveBeenCalled();
    });

    it("CAT-06: should reject deletion of a category in use", async () => {
      repo.findCategoryById.mockResolvedValue({ id: "cat-1" });
      repo.countCategoryUsage.mockResolvedValue(2);

      await expect(
        blogService.deleteCategory("cat-1")
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.deleteCategoryById).not.toHaveBeenCalled();
    });

    it("CAT-07: should delete an unused category", async () => {
      repo.findCategoryById.mockResolvedValue({ id: "cat-1" });
      repo.countCategoryUsage.mockResolvedValue(0);
      repo.deleteCategoryById.mockResolvedValue({ id: "cat-1" });

      await expect(
        blogService.deleteCategory("cat-1")
      ).resolves.toEqual({ id: "cat-1" });

      expect(repo.deleteCategoryById).toHaveBeenCalledWith("cat-1");
    });

    it("CAT-08: should return all categories from the repository", async () => {
      repo.findAllCategories.mockResolvedValue([{ id: "cat-1" }]);

      await expect(blogService.getAllCategories())
        .resolves.toEqual([{ id: "cat-1" }]);
    });
  });

  describe("tag management", () => {
    it("TAG-01: should create a tag with a generated slug", async () => {
      prisma.blogTag.findUnique.mockResolvedValue(null);
      repo.createTag.mockResolvedValue({
        id: "tag-1",
        name: "Aquarium Tips",
        slug: "aquarium-tips",
      });

      await blogService.createTag({ name: "Aquarium Tips" });

      expect(prisma.blogTag.findUnique).toHaveBeenCalledWith({
        where: { slug: "aquarium-tips" },
      });
      expect(repo.createTag).toHaveBeenCalledWith({
        name: "Aquarium Tips",
        slug: "aquarium-tips",
      });
    });

    it("TAG-02: should reject duplicate tag names", async () => {
      prisma.blogTag.findUnique.mockResolvedValue({ id: "existing" });

      await expect(
        blogService.createTag({ name: "Aquarium Tips" })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.createTag).not.toHaveBeenCalled();
    });

    it("TAG-03: should update a tag with its generated slug", async () => {
      repo.findTagBySlug.mockResolvedValue(null);
      repo.updateTagRecordNode.mockResolvedValue({ id: "tag-1" });

      await blogService.updateTag("tag-1", { name: "Water Quality" });

      expect(repo.findTagBySlug)
        .toHaveBeenCalledWith("water-quality", "tag-1");
      expect(repo.updateTagRecordNode).toHaveBeenCalledWith(
        "tag-1",
        { name: "Water Quality", slug: "water-quality" }
      );
    });

    it("TAG-04: should reject a duplicate tag slug during update", async () => {
      repo.findTagBySlug.mockResolvedValue({ id: "tag-2" });

      await expect(
        blogService.updateTag("tag-1", { name: "Water Quality" })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.updateTagRecordNode).not.toHaveBeenCalled();
    });

    it("TAG-05: should reject deletion of a missing tag", async () => {
      repo.findTagById.mockResolvedValue(null);

      await expect(
        blogService.deleteTag("missing")
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(repo.countTagUsage).not.toHaveBeenCalled();
    });

    it("TAG-06: should reject deletion of a tag in use", async () => {
      repo.findTagById.mockResolvedValue({ id: "tag-1" });
      repo.countTagUsage.mockResolvedValue(1);

      await expect(
        blogService.deleteTag("tag-1")
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(repo.deleteTagById).not.toHaveBeenCalled();
    });

    it("TAG-07: should delete an unused tag", async () => {
      repo.findTagById.mockResolvedValue({ id: "tag-1" });
      repo.countTagUsage.mockResolvedValue(0);
      repo.deleteTagById.mockResolvedValue({ id: "tag-1" });

      await expect(
        blogService.deleteTag("tag-1")
      ).resolves.toEqual({ id: "tag-1" });

      expect(repo.deleteTagById).toHaveBeenCalledWith("tag-1");
    });

    });
  });
});
