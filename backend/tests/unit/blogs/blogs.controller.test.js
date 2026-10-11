import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../src/shared/errors/AppError.js";
import * as blogService from "../../../src/modules/blogs/blogs.service.js";
import * as repo from "../../../src/modules/blogs/blogs.repository.js";
import * as fingerprint from "../../../src/shared/utils/fingerprint.js";

import {
  createBlogPostController,
  getAdminBlogsGridController,
  getAdminBlogByIdController,
  updateBlogPostController,
  deleteBlogPostController,
  getBlogPreviewStatusController,
  generateBlogPreviewLinkController,
  revokeBlogPreviewLinkController,
  getPublicBlogsGridController,
  getPublicSingleBlogDetailsController,
  resolvePublicBlogPreviewController,
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
  createTagController,
  getAllTagsController,
  updateTagController,
  deleteTagController
} from "../../../src/modules/blogs/blogs.controller.js";

// Mocking dependencies
vi.mock("../../../src/modules/blogs/blogs.service.js");
vi.mock("../../../src/modules/blogs/blogs.repository.js");
vi.mock("../../../src/shared/utils/fingerprint.js");

describe("Blogs Controller", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default Express mocks
    req = {
      body: {},
      params: {},
      query: {},
      user: {
        id: "user_123",
        systemRole: { slug: "ADMIN" },
        permissions: ["blog.edit", "blog.view"]
      },
      headers: {},
      socket: { remoteAddress: "127.0.0.1" },
      path: "/blog/some-path"
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      set: vi.fn(),
      header: vi.fn()
    };

    next = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("A. createBlogPostController", () => {
    it("CB-01: Successful blog creation returns 201 and data", async () => {
      req.body = { title: "New Blog" };
      const mockBlog = { id: "blog_1", title: "New Blog" };
      blogService.createBlog.mockResolvedValue(mockBlog);

      await createBlogPostController(req, res, next);

      expect(blogService.createBlog).toHaveBeenCalledWith(req.body, "user_123");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: "Blog post successfully initialized.",
        data: mockBlog
      }));
    });

    it("CB-02: Service failure is forwarded to next()", async () => {
      const error = new AppError("Validation Failed", 400);
      blogService.createBlog.mockRejectedValue(error);

      await createBlogPostController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("B. getAdminBlogsGridController", () => {
    it("AB-01: Admin listing success returns 200 with data and meta", async () => {
      req.query = { page: 1, limit: 10 };
      const mockResult = { data: [{ id: 1 }], meta: { total: 1 } };
      blogService.getAdminBlogs.mockResolvedValue(mockResult);

      await getAdminBlogsGridController(req, res, next);

      expect(blogService.getAdminBlogs).toHaveBeenCalledWith(
        req.query, "user_123", "ADMIN", req.user.permissions
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockResult.data,
        meta: mockResult.meta
      }));
    });

    it("AB-02: Optional role handling works without crashing", async () => {
      req.user.systemRole = undefined; // Simulating missing role
      blogService.getAdminBlogs.mockResolvedValue({ data: [], meta: {} });

      await getAdminBlogsGridController(req, res, next);

      expect(blogService.getAdminBlogs).toHaveBeenCalledWith(
        req.query, "user_123", undefined, req.user.permissions
      );
    });

    it("AB-03: Listing service error is forwarded", async () => {
      const error = new Error("DB Error");
      blogService.getAdminBlogs.mockRejectedValue(error);

      await getAdminBlogsGridController(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("C. getAdminBlogByIdController", () => {
    it("AD-01: Blog retrieved successfully", async () => {
      req.params.id = "blog_1";
      const mockBlog = { id: "blog_1" };
      blogService.getAdminBlogByIdSecure.mockResolvedValue(mockBlog);

      await getAdminBlogByIdController(req, res, next);

      expect(blogService.getAdminBlogByIdSecure).toHaveBeenCalledWith(
        "blog_1", "user_123", "ADMIN", req.user.permissions
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockBlog }));
    });

    it("AD-02: Service error forwarded", async () => {
      const error = new AppError("Not found", 404);
      blogService.getAdminBlogByIdSecure.mockRejectedValue(error);

      await getAdminBlogByIdController(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("D. updateBlogPostController", () => {
    it("UBC-01: Blog update success", async () => {
      req.params.id = "blog_1";
      req.body = { title: "Updated" };
      blogService.updateBlog.mockResolvedValue({ id: "blog_1", title: "Updated" });

      await updateBlogPostController(req, res, next);

      expect(blogService.updateBlog).toHaveBeenCalledWith(
        "blog_1", req.body, "user_123", "ADMIN", req.user.permissions
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("UBC-02: Update error forwarded", async () => {
      blogService.updateBlog.mockRejectedValue(new Error("Update failed"));
      await updateBlogPostController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("E. deleteBlogPostController", () => {
    it("DBC-01: Delete success returns 200 and 'Archived.' message", async () => {
      req.params.id = "blog_1";
      blogService.deleteBlog.mockResolvedValue(true);

      await deleteBlogPostController(req, res, next);

      expect(blogService.deleteBlog).toHaveBeenCalledWith(
        "blog_1", "user_123", "ADMIN", req.user.permissions
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Archived." }));
    });

    it("DBC-02: Delete failure forwards error", async () => {
      blogService.deleteBlog.mockRejectedValue(new Error("Delete failed"));
      await deleteBlogPostController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("F. getBlogPreviewStatusController", () => {
    it("PS-01: Preview status returned", async () => {
      req.params.id = "blog_1";
      blogService.getBlogPreviewStatus.mockResolvedValue({ isActive: true });

      await getBlogPreviewStatusController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Blog preview link status retrieved successfully.",
        data: { isActive: true }
      }));
    });

    it("PS-02: Status lookup error forwards to next", async () => {
      blogService.getBlogPreviewStatus.mockRejectedValue(new Error("Err"));
      await getBlogPreviewStatusController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("G. generateBlogPreviewLinkController", () => {
    it("PG-01: Uses configured CLIENT_URL", async () => {
      vi.stubEnv("CLIENT_URL", "https://production.com");
      req.params.id = "blog_1";
      blogService.generatePreviewLink.mockResolvedValue({ previewUrl: "url" });

      await generateBlogPreviewLinkController(req, res, next);

      expect(blogService.generatePreviewLink).toHaveBeenCalledWith(
        "blog_1", "user_123", "ADMIN", req.user.permissions, "https://production.com"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it("PG-02: Fallback to localhost if CLIENT_URL is unavailable", async () => {
      vi.stubEnv("CLIENT_URL", ""); // Empty string
      blogService.generatePreviewLink.mockResolvedValue({ previewUrl: "url" });

      await generateBlogPreviewLinkController(req, res, next);

      expect(blogService.generatePreviewLink).toHaveBeenCalledWith(
        undefined, "user_123", "ADMIN", req.user.permissions, "http://localhost:5173"
      );
    });

    it("PG-03: Preview generation error is forwarded", async () => {
      blogService.generatePreviewLink.mockRejectedValue(new Error("Err"));
      await generateBlogPreviewLinkController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("H. revokeBlogPreviewLinkController", () => {
    it("PR-01: Preview link revoked successfully", async () => {
      blogService.revokePreviewLink.mockResolvedValue(true);
      await revokeBlogPreviewLinkController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Link revoked successfully." }));
    });

    it("PR-02: Revoke failure forwards to next", async () => {
      blogService.revokePreviewLink.mockRejectedValue(new Error("Fail"));
      await revokeBlogPreviewLinkController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("I. getPublicBlogsGridController", () => {
    it("PBL-01: Public blog listing success", async () => {
      req.query = { page: 2 };
      const mockResult = { data: [], meta: { page: 2 } };
      blogService.getPublicBlogs.mockResolvedValue(mockResult);

      await getPublicBlogsGridController(req, res, next);

      expect(blogService.getPublicBlogs).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("PBL-02: Public listing failure forwarded", async () => {
      blogService.getPublicBlogs.mockRejectedValue(new Error("Err"));
      await getPublicBlogsGridController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("J. getPublicSingleBlogDetailsController (Redirect & Old Slug Logic)", () => {
    beforeEach(() => {
      req.params.slug = "old-slug";
      fingerprint.generateRequestFingerprint.mockReturnValue("mock-fingerprint");
    });

    it("PD-01: Published blog details success without redirect", async () => {
      blogService.getBlogBySlug.mockResolvedValue({ blog: { id: "1" } });

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(blogService.getBlogBySlug).toHaveBeenCalledWith("old-slug", "mock-fingerprint");
      expect(repo.findBlogIdByOldSlug).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { blog: { id: "1" } } }));
    });

    it("PD-02: Old slug belongs to an active published blog -> 301 Redirect", async () => {
      const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
      blogService.getBlogBySlug.mockRejectedValue(notFoundError);
      
      repo.findBlogIdByOldSlug.mockResolvedValue({
        blog: { status: "PUBLISHED", deletedAt: null, slug: "new-slug" }
      });

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(repo.findBlogIdByOldSlug).toHaveBeenCalledWith("old-slug");
      expect(res.status).toHaveBeenCalledWith(301);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Content has moved permanently.",
        data: {
          redirect: true,
          newSlug: "new-slug",
          newUrl: "/blog/new-slug"
        }
      }));
    });

    it("PD-03: No historical slug exists -> Forward original 404 error", async () => {
      const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
      blogService.getBlogBySlug.mockRejectedValue(notFoundError);
      repo.findBlogIdByOldSlug.mockResolvedValue(null);

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it("PD-04: Historical slug belongs to a non-published blog -> Forward original 404 error", async () => {
      const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
      blogService.getBlogBySlug.mockRejectedValue(notFoundError);
      repo.findBlogIdByOldSlug.mockResolvedValue({
        blog: { status: "DRAFT", deletedAt: null, slug: "new-slug" }
      });

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it("PD-05: Historical blog was deleted -> Forward original 404 error", async () => {
      const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
      blogService.getBlogBySlug.mockRejectedValue(notFoundError);
      repo.findBlogIdByOldSlug.mockResolvedValue({
        blog: { status: "PUBLISHED", deletedAt: new Date(), slug: "new-slug" }
      });

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });

    it("PD-06: Non-404 service error -> Forward without old slug lookup", async () => {
      const serverError = new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
      blogService.getBlogBySlug.mockRejectedValue(serverError);

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(repo.findBlogIdByOldSlug).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serverError);
    });

    it("PD-07: Historical slug lookup itself fails -> Forwards repository error", async () => {
      const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
      const dbError = new Error("DB Connection failed");
      
      blogService.getBlogBySlug.mockRejectedValue(notFoundError);
      repo.findBlogIdByOldSlug.mockRejectedValue(dbError);

      await getPublicSingleBlogDetailsController(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe("K. resolvePublicBlogPreviewController", () => {
    it("PV-01: Preview token resolves and sets X-Robots-Tag header", async () => {
      req.body = { token: "secret-token" };
      const mockData = { preview: true };
      blogService.resolvePreviewToken.mockResolvedValue(mockData);

      await resolvePublicBlogPreviewController(req, res, next);

      expect(blogService.resolvePreviewToken).toHaveBeenCalledWith("secret-token");
      expect(res.set).toHaveBeenCalledWith("X-Robots-Tag", "noindex, nofollow");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockData }));
    });

    it("PV-02: Invalid/expired token error is forwarded", async () => {
      blogService.resolvePreviewToken.mockRejectedValue(new AppError("Expired", 410));
      await resolvePublicBlogPreviewController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("L. Category Controllers", () => {
    it("CAT-01: createCategoryController success", async () => {
      blogService.createCategory.mockResolvedValue({ id: 1 });
      await createCategoryController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it("CAT-02: createCategoryController error", async () => {
      blogService.createCategory.mockRejectedValue(new Error());
      await createCategoryController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("CAT-03: getAllCategoriesController success", async () => {
      blogService.getAllCategories.mockResolvedValue([]);
      await getAllCategoriesController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("CAT-04: getAllCategoriesController error", async () => {
      blogService.getAllCategories.mockRejectedValue(new Error());
      await getAllCategoriesController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("CAT-05: updateCategoryController success", async () => {
      blogService.updateCategory.mockResolvedValue({ id: 1 });
      await updateCategoryController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("CAT-06: updateCategoryController error", async () => {
      blogService.updateCategory.mockRejectedValue(new Error());
      await updateCategoryController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("CAT-07: deleteCategoryController success", async () => {
      blogService.deleteCategory.mockResolvedValue(true);
      await deleteCategoryController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Category dropped successfully." }));
    });

    it("CAT-08: deleteCategoryController error", async () => {
      blogService.deleteCategory.mockRejectedValue(new Error());
      await deleteCategoryController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("M. Tag Controllers", () => {
    it("TAG-01: createTagController success", async () => {
      blogService.createTag.mockResolvedValue({ id: 1 });
      await createTagController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it("TAG-02: createTagController error", async () => {
      blogService.createTag.mockRejectedValue(new Error());
      await createTagController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("TAG-03: getAllTagsController success", async () => {
      blogService.getAllTags.mockResolvedValue([]);
      await getAllTagsController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("TAG-04: getAllTagsController error", async () => {
      blogService.getAllTags.mockRejectedValue(new Error());
      await getAllTagsController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("TAG-05: updateTagController success", async () => {
      blogService.updateTag.mockResolvedValue({ id: 1 });
      await updateTagController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it("TAG-06: updateTagController error", async () => {
      blogService.updateTag.mockRejectedValue(new Error());
      await updateTagController(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("TAG-07: deleteTagController success", async () => {
      blogService.deleteTag.mockResolvedValue(true);
      await deleteTagController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Tag configuration dropped safely." }));
    });

    it("TAG-08: deleteTagController error", async () => {
      blogService.deleteTag.mockRejectedValue(new Error());
      await deleteTagController(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});