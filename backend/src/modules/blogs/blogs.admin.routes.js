import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
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

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Categories
router.post("/categories", validate(createTaxonomySchema, "body"), controller.createCategoryController);
router.get("/categories", controller.getAllCategoriesController);
router.patch("/categories/:id", validate(blogParamSchema, "params"), validate(createTaxonomySchema, "body"), controller.updateCategoryController);
router.delete("/categories/:id", validate(blogParamSchema, "params"), controller.deleteCategoryController);

// Tags
router.post("/tags", validate(createTaxonomySchema, "body"), controller.createTagController);
router.get("/tags", controller.getAllTagsController);
router.patch("/tags/:id", validate(blogParamSchema, "params"), validate(createTaxonomySchema, "body"), controller.updateTagController);
router.delete("/tags/:id", validate(blogParamSchema, "params"), controller.deleteTagController);

// Blog Posts
router.post("/", validate(createBlogSchema, "body"), controller.createBlogPostController);
router.get("/", validate(blogQuerySchema, "query"), controller.getAdminBlogsGridController);
router.post("/:id/preview-link", validate(blogParamSchema, "params"), controller.generateBlogPreviewLinkController);
router.delete("/:id/preview-link", validate(blogParamSchema, "params"), controller.revokeBlogPreviewLinkController);
router.get("/:id", validate(blogParamSchema, "params"), controller.getAdminBlogByIdController);
router.patch("/:id", validate(blogParamSchema, "params"), validate(updateBlogSchema, "body"), controller.updateBlogPostController);
router.delete("/:id", validate(blogParamSchema, "params"), controller.deleteBlogPostController);

export default router;