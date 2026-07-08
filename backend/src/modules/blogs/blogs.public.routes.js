import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { blogQuerySchema, blogSlugParamSchema, blogPreviewTokenParamSchema } from "./blogs.validation.js";
import * as controller from "./blogs.controller.js";

const router = Router();

router.get("/", validate(blogQuerySchema, "query"), controller.getPublicBlogsGridController);
//router.get("/preview/:token", validate(blogPreviewTokenParamSchema, "params"), controller.resolvePublicBlogPreviewController);
router.post("/preview/resolve", validate(blogPreviewTokenParamSchema, "body"), controller.resolvePublicBlogPreviewController);

router.get("/categories", controller.getAllCategoriesController);
router.get("/tags", controller.getAllTagsController);

router.get("/:slug", validate(blogSlugParamSchema, "params"), controller.getPublicSingleBlogDetailsController);

export default router;