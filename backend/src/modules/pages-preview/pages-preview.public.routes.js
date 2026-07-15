import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { previewTokenParamSchema } from "./pages-preview.validation.js";
import { getPreviewPageDataController } from "./pages-preview.controller.js";

const router = Router();

const previewRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: { success: false, message: "Too many preview resolution attempts. Please pause and retry." }
});

//router.get("/:token", previewRateLimiter, validate(previewTokenParamSchema, "params"), getPreviewPageDataController);
router.post("/resolve", previewRateLimiter, validate(previewTokenParamSchema, "body"), getPreviewPageDataController);

export default router;