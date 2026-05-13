import { Router } from "express";
import {
  register,
  login,
  adminLoginController,
  refreshTokenController,
  logoutController,
  logoutAllDevicesController,
} from "./auth.controller.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import {
  authRateLimiter,
  adminAuthRateLimiter,
  refreshTokenRateLimiter,
} from "../../shared/middlewares/rateLimit.middleware.js";

const router = Router();

// USER REGISTRATION

router.post(
  "/register",

  authRateLimiter,
  validate(registerSchema),
  register
);

// USER LOGIN

router.post(
  "/login",

  authRateLimiter,
  validate(loginSchema),
  login
);

// ADMIN LOGIN

router.post(
  "/admin-login",

  adminAuthRateLimiter,
  validate(loginSchema),
  adminLoginController
);

// REFRESH ACCESS TOKEN

router.post(
  "/refresh-token",

  refreshTokenRateLimiter,
  refreshTokenController
);


// LOGOUT CURRENT DEVICE

router.post(
  "/logout",

  logoutController
);

// LOGOUT ALL DEVICES
router.post(
  "/logout-all",

  authenticate,
  logoutAllDevicesController
);

export default router;