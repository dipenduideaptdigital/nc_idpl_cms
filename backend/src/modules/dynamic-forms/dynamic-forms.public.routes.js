import { Router } from "express";
import * as controller from "./dynamic-forms.controller.js";
import { sensitiveOperationRateLimiter } from "../../shared/middlewares/rateLimit.middleware.js";

const router = Router();

// Fetch form schema and settings by slug
router.get("/:slug", controller.getPublicFormController);

// Submit form data
router.post(
  "/:slug/submit",
  sensitiveOperationRateLimiter,
  controller.submitPublicFormController
);

export default router;