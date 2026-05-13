import rateLimit from "express-rate-limit";

export const authRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

export const adminAuthRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many admin login attempts. Please try again later.",
    },
  });

export const refreshTokenRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many token refresh requests.",
    },
  });