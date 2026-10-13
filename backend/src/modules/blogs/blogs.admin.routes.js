import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./blogs.controller.js";
import {
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
  blogParamSchema,
  createTaxonomySchema,
} from "./blogs.validation.js";

const router = Router();

const getSystemRoleSlug = (req) =>
  typeof req.user?.systemRole === "string"
    ? req.user.systemRole
    : req.user?.systemRole?.slug;

const requirePublishPermissionWhenPublished = (req, res, next) => {
  if (req.body?.status !== "PUBLISHED") return next();

  if (getSystemRoleSlug(req) === "SUPER_ADMIN") return next();

  const permissions = req.user?.permissions || [];

  if (permissions.includes("blog.publish")) return next();

  return next(
    new AppError(
      "Publishing permission required.",
      StatusCodes.FORBIDDEN
    )
  );
};

const requireBlogUpdateAccess = (req, res, next) => {
  if (getSystemRoleSlug(req) === "SUPER_ADMIN") return next();

  const permissions = req.user?.permissions || [];

  if (
    permissions.includes("blog.edit") ||
    permissions.includes("blog.create")
  ) {
    return next();
  }

  return next(
    new AppError(
      "Blog update permission required.",
      StatusCodes.FORBIDDEN
    )
  );
};

//  authentication and role check for all routes in this file
router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Categories - Assigning taxonomy permissions
router.post("/categories", requirePermission("taxonomy.create"), validate(createTaxonomySchema, "body"), controller.createCategoryController);
router.get("/categories", requirePermission("taxonomy.view"), controller.getAllCategoriesController);
router.patch("/categories/:id", requirePermission("taxonomy.edit"), validate(blogParamSchema, "params"), validate(createTaxonomySchema, "body"), controller.updateCategoryController);
router.delete("/categories/:id", requirePermission("taxonomy.delete"), validate(blogParamSchema, "params"), controller.deleteCategoryController);

// Tags - Assigning taxonomy permissions
router.post("/tags", requirePermission("taxonomy.create"), validate(createTaxonomySchema, "body"), controller.createTagController);
router.get("/tags", requirePermission("taxonomy.view"), controller.getAllTagsController);
router.patch("/tags/:id", requirePermission("taxonomy.edit"), validate(blogParamSchema, "params"), validate(createTaxonomySchema, "body"), controller.updateTagController);
router.delete("/tags/:id", requirePermission("taxonomy.delete"), validate(blogParamSchema, "params"), controller.deleteTagController);

// Blog Posts - Applying granular functional permissions
router.post(
  "/",
  requirePermission("blog.create"),
  validate(createBlogSchema, "body"),
  requirePublishPermissionWhenPublished,
  controller.createBlogPostController
);
router.get("/", requirePermission("blog.view"), validate(blogQuerySchema, "query"), controller.getAdminBlogsGridController);

// Preview endpoints secured with preview permission
router.get("/:id/preview-link", requirePermission("blog.preview"), validate(blogParamSchema, "params"), controller.getBlogPreviewStatusController);
router.post("/:id/preview-link", requirePermission("blog.preview"), validate(blogParamSchema, "params"), controller.generateBlogPreviewLinkController);
router.delete("/:id/preview-link", requirePermission("blog.preview"), validate(blogParamSchema, "params"), controller.revokeBlogPreviewLinkController);

// Standard CRUD endpoints secured
router.get("/:id", requirePermission("blog.view"), validate(blogParamSchema, "params"), controller.getAdminBlogByIdController);
router.patch(
  "/:id",
  requireBlogUpdateAccess,
  validate(blogParamSchema, "params"),
  validate(updateBlogSchema, "body"),
  requirePublishPermissionWhenPublished,
  controller.updateBlogPostController
);
router.delete("/:id", requirePermission("blog.delete"), validate(blogParamSchema, "params"), controller.deleteBlogPostController);

export default router;