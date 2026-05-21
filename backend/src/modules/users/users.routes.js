import { Router } from "express";
import { getMyProfileController, updateMyProfileController } from "./users.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { updateProfileSchema } from "./users.validation.js";
import { sensitiveOperationRateLimiter } from "../../shared/middlewares/rateLimit.middleware.js";

const router = Router();

// Get current user profile
router.get("/me", authenticate, getMyProfileController);

// Update current user profile
router.patch("/me", authenticate, sensitiveOperationRateLimiter, validate(updateProfileSchema), updateMyProfileController);

export default router;