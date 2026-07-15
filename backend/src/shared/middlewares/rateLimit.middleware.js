import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

// Common rate limit response
const rateLimitHandler = (message) => {
  return (req, res) => {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message,
      retryAfter: req.rateLimit?.resetTime || null,
    });
  };
};

// Common rate limit 
const createRateLimiter = ({
  windowMs,
  max,
  message,
  keyGenerator,
  skipSuccessfulRequests = false,
}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: rateLimitHandler(message),
    keyGenerator,
  });
};

// Auth limiter
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts. Please try again later.",
});

// Admin auth limiter
export const adminAuthRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many admin login attempts. Please try again later.",
});

// Refresh token limiter
export const refreshTokenRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many token refresh requests.",
});

// operations limiter
export const sensitiveOperationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many sensitive account operations. Please try again later.",
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return req.user ? `${req.user.id}_${ip}` : ip;
  },
});