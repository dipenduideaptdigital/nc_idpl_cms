import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

// Mock IP normalization: ipKeyGenerator receives an IP string, not req.
vi.mock("express-rate-limit", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    ipKeyGenerator: (ip) => ip || "127.0.0.1",
  };
});

import {
  authRateLimiter,
  adminAuthRateLimiter,
  refreshTokenRateLimiter,
  sensitiveOperationRateLimiter,
} from "../../../src/shared/middlewares/rateLimit.middleware.js";

describe("Rate Limit Middlewares", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.set("trust proxy", 1);
    app.use((req, res, next) => {
      Object.defineProperty(req, "ip", { 
        value: req.headers["x-forwarded-for"] || "127.0.0.1", 
        configurable: true 
      });
      next();
    });

    app.post("/auth", authRateLimiter, (req, res) => res.status(StatusCodes.OK).json({ success: true }));
    app.post("/admin-auth", adminAuthRateLimiter, (req, res) => res.status(StatusCodes.OK).json({ success: true }));
    app.post("/refresh", refreshTokenRateLimiter, (req, res) => res.status(StatusCodes.OK).json({ success: true }));

    app.post("/sensitive", sensitiveOperationRateLimiter, (req, res) => res.status(StatusCodes.OK).json({ success: true }));

    app.post("/sensitive-auth", (req, res, next) => {
      if (req.headers["x-mock-user-id"]) {
        req.user = { id: req.headers["x-mock-user-id"] };
      }
      next();
    }, sensitiveOperationRateLimiter, (req, res) => res.status(StatusCodes.OK).json({ success: true }));
  });

  describe("Basic Limiter Behavior (Standard Thresholds)", () => {
    it("should allow standard requests within the configured limit", async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post("/auth");
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
      }
    });

    it("should block requests and return correct JSON structure when admin auth limit is exceeded", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post("/admin-auth");
      }

      const res = await request(app).post("/admin-auth");
      expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Too many admin login attempts. Please try again later.");
      expect(res.body).toHaveProperty("retryAfter");
    });
    
    it("should block excessive refresh token requests", async () => {
      for (let i = 0; i < 20; i++) {
        await request(app).post("/refresh");
      }

      const res = await request(app).post("/refresh");
      expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
      expect(res.body.message).toBe("Too many token refresh requests.");
    });
  });

  describe("Sensitive Operation Limiter (Custom Key Generator Logic)", () => {
    it("should track rate limits based strictly on IP for unauthenticated users", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post("/sensitive").set("X-Forwarded-For", "192.168.1.100");
      }
      
      const res = await request(app).post("/sensitive").set("X-Forwarded-For", "192.168.1.100");
      expect(res.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
      expect(res.body.message).toBe("Too many sensitive account operations. Please try again later.");
    });

    it("should maintain separate limits for different authenticated users operating from the same IP", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/sensitive-auth")
          .set("x-mock-user-id", "user_A")
          .set("X-Forwarded-For", "192.168.1.200");
      }
      
      const resUserA = await request(app)
        .post("/sensitive-auth")
        .set("x-mock-user-id", "user_A")
        .set("X-Forwarded-For", "192.168.1.200");
      expect(resUserA.status).toBe(StatusCodes.TOO_MANY_REQUESTS);

      const resUserB = await request(app)
        .post("/sensitive-auth")
        .set("x-mock-user-id", "user_B")
        .set("X-Forwarded-For", "192.168.1.200");
      expect(resUserB.status).toBe(StatusCodes.OK);
    });
  });
});