import { Router } from "express";
import {
  register,
  login,
  adminLoginController,
  refreshTokenController,
  logoutController,
  logoutAllDevicesController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
  setupAdminAccountController,
  meController
} from "./auth.controller.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.validation.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import {
  authRateLimiter,
  adminAuthRateLimiter,
  refreshTokenRateLimiter,
  sensitiveOperationRateLimiter,
} from "../../shared/middlewares/rateLimit.middleware.js";

const router = Router();

// User registration
router.post("/register", authRateLimiter, validate(registerSchema), register);

// User login
router.post("/login", authRateLimiter, validate(loginSchema), login);

// Admin login
router.post("/admin-login", adminAuthRateLimiter, validate(loginSchema), adminLoginController);

// Refresh access token
router.post("/refresh-token", refreshTokenRateLimiter, refreshTokenController);

// Forgot password
router.post("/forgot-password", sensitiveOperationRateLimiter, validate(forgotPasswordSchema), forgotPasswordController);

// Reset password
router.post("/reset-password", sensitiveOperationRateLimiter, validate(resetPasswordSchema), resetPasswordController);

// Change password
router.patch("/change-password", authenticate, sensitiveOperationRateLimiter, validate(changePasswordSchema), changePasswordController);

router.get("/me", authenticate, meController);
// Logout current device
router.post("/logout", logoutController);

// Logout all devices
router.post("/logout-all", authenticate, sensitiveOperationRateLimiter, logoutAllDevicesController);

router.post("/setup-admin", setupAdminAccountController);

export default router;