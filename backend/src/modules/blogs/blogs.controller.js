import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { generateRequestFingerprint } from "../../shared/utils/fingerprint.js"; 
import * as blogService from "./blogs.service.js";
import * as repo from "./blogs.repository.js";

export const createBlogPostController = asyncHandler(async (req, res) => {
  const post = await blogService.createBlog(req.body, req.user.id);
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Blog post successfully initialized.", data: post });
});

export const getAdminBlogsGridController = asyncHandler(async (req, res) => {
  const result = await blogService.getAdminBlogs(req.query, req.user.id, req.user.systemRole?.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, data: result.data, meta: result.meta });
});

export const getAdminBlogByIdController = asyncHandler(async (req, res) => {
  const blog = await blogService.getAdminBlogByIdSecure(req.params.id, req.user.id, req.user.systemRole?.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, data: blog });
});

export const updateBlogPostController = asyncHandler(async (req, res) => {
  const updated = await blogService.updateBlog(req.params.id, req.body, req.user.id, req.user.systemRole?.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, data: updated });
});

export const deleteBlogPostController = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.params.id, req.user.id, req.user.systemRole?.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Archived." });
});

export const getBlogPreviewStatusController = asyncHandler(async (req, res) => {
  const status = await blogService.getBlogPreviewStatus(req.params.id); 
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Blog preview link status retrieved successfully.", data: status });
});

export const generateBlogPreviewLinkController = asyncHandler(async (req, res) => {
  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await blogService.generatePreviewLink(req.params.id, req.user.id, req.user.systemRole?.slug, frontendUrl);
  sendResponse({ res, statusCode: StatusCodes.CREATED, data: result });
});

export const revokeBlogPreviewLinkController = asyncHandler(async (req, res) => {
  await blogService.revokePreviewLink(req.params.id, req.user.id, req.user.systemRole?.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Link revoked successfully." });
});

export const getPublicBlogsGridController = asyncHandler(async (req, res) => {
  const result = await blogService.getPublicBlogs(req.query);
  sendResponse({ res, statusCode: StatusCodes.OK, data: result.data, meta: result.meta });
});

export const getPublicSingleBlogDetailsController = asyncHandler(async (req, res) => {
  const fingerprint = generateRequestFingerprint(req); 
  const slug = req.params.slug;

  try {
    const detailManifest = await blogService.getBlogBySlug(slug, fingerprint);
    sendResponse({ res, statusCode: StatusCodes.OK, data: detailManifest });
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      const historyRecord = await repo.findBlogIdByOldSlug(slug);
      
      if (historyRecord && historyRecord.blog.status === "PUBLISHED" && !historyRecord.blog.deletedAt) {
        return sendResponse({
          res,
          statusCode: 301, 
          message: "Content has moved permanently.",
          data: {
            redirect: true,
            newSlug: historyRecord.blog.slug,
            newUrl: `/blog/${historyRecord.blog.slug}`
          }
        });
      }
    }
    throw error;
  }
});

export const resolvePublicBlogPreviewController = asyncHandler(async (req, res) => {
  const rawToken = req.params.token; 
  const blogNodeData = await blogService.resolvePreviewToken(rawToken);
  res.set("X-Robots-Tag", "noindex, nofollow");
  sendResponse({ res, statusCode: StatusCodes.OK, data: blogNodeData });
});

export const createCategoryController = asyncHandler(async (req, res) => {
  const node = await blogService.createCategory(req.body);
  sendResponse({ res, statusCode: StatusCodes.CREATED, data: node });
});

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const list = await blogService.getAllCategories();
  sendResponse({ res, statusCode: StatusCodes.OK, data: list });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const node = await blogService.updateCategory(req.params.id, req.body);
  sendResponse({ res, statusCode: StatusCodes.OK, data: node });
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  await blogService.deleteCategory(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Category dropped successfully." });
});

export const createTagController = asyncHandler(async (req, res) => {
  const node = await blogService.createTag(req.body);
  sendResponse({ res, statusCode: StatusCodes.CREATED, data: node });
});

export const getAllTagsController = asyncHandler(async (req, res) => {
  const list = await blogService.getAllTags();
  sendResponse({ res, statusCode: StatusCodes.OK, data: list });
});

export const updateTagController = asyncHandler(async (req, res) => {
  const node = await blogService.updateTag(req.params.id, req.body);
  sendResponse({ res, statusCode: StatusCodes.OK, data: node });
});

export const deleteTagController = asyncHandler(async (req, res) => {
  await blogService.deleteTag(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Tag configuration dropped safely." });
});