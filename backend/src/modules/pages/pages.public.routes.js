import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./pages.controller.js";
import { pageSlugParamSchema } from "./pages.validation.js";

const router = Router();

router.get(
  "/:slug", 
  validate(pageSlugParamSchema, "params"), 
  controller.getPublicPageController
);

export default router;