import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { systemStateGatekeeper } from "../../../src/shared/middlewares/systemState.middleware.js";
import { systemStateStore } from "../../../src/shared/core/systemStateStore.js";
import { logger } from "../../../src/config/logger.js";

vi.mock("../../../src/shared/core/systemStateStore.js", () => ({
  systemStateStore: { get: vi.fn() }
}));

vi.mock("../../../src/config/logger.js", () => ({
  logger: { info: vi.fn(), error: vi.fn() }
}));

describe("System State Gatekeeper Middleware", () => {
  let req, res, next;
  let originalNodeEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalNodeEnv = process.env.NODE_ENV;

    req = {
      path: "/api/v1/projects",
      query: {},
      cookies: {},
      ip: "192.168.1.10",
    };

    res = {
      set: vi.fn(),
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  const maintenanceConfig = {
    state: "MAINTENANCE",
    bypassToken: "valid-bypass-token-123",
    title: "System Upgrade",
    description: "We are upgrading the database.",
    estimatedCompletion: "2026-10-10",
    supportEmail: "support@example.com",
    supportPhone: "1234567890",
    showSocialLinks: true,
    backgroundImage: "bg.jpg",
  };

  it("GATE-01: should allow request to pass if systemStateStore.get() is null", () => {
    systemStateStore.get.mockReturnValue(null);
    systemStateGatekeeper(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("GATE-02: should allow request to pass if state is ACTIVE", () => {
    systemStateStore.get.mockReturnValue({ state: "ACTIVE" });
    systemStateGatekeeper(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  describe("Maintenance Mode Exclusions", () => {
    beforeEach(() => {
      systemStateStore.get.mockReturnValue(maintenanceConfig);
    });

    it("GATE-03 & GATE-04: should allow static asset extensions and be case-insensitive", () => {
      const staticPaths = [
        "/images/logo.png", "/style.css", "/script.js", "/font.woff2", "/video.mp4", "/ASSET.JPG"
      ];

      staticPaths.forEach((path) => {
        req.path = path;
        systemStateGatekeeper(req, res, next);
      });

      expect(next).toHaveBeenCalledTimes(staticPaths.length);
    });

    it("GATE-05: should allow whitelisted paths defined in isWhitelistedPath()", () => {
      const whitelistPaths = [
        "/api/v1/auth/login",
        "/api/v1/admin/dashboard",
        "/api/v1/health",
        "/api/v1/uploads/image.jpg",
        "/robots.txt",
        "/sitemap.xml",
        "/sitemap-pages.xml",
        "/sitemap-blogs.xml"
      ];

      whitelistPaths.forEach((path) => {
        req.path = path;
        systemStateGatekeeper(req, res, next);
      });

      expect(next).toHaveBeenCalledTimes(whitelistPaths.length);
    });
  });

  describe("Maintenance Bypass Token (Stakeholder Logic)", () => {
    beforeEach(() => {
      systemStateStore.get.mockReturnValue(maintenanceConfig);
    });

    it("GATE-06 & GATE-07: should allow request and set development cookie if query token is valid", () => {
      process.env.NODE_ENV = "development";
      req.query.maintenance_bypass = "valid-bypass-token-123";

      systemStateGatekeeper(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith("maintenance_bypass_token", "valid-bypass-token-123", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(logger.info).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("GATE-08: should set production secure cookie if query token is valid", () => {
      process.env.NODE_ENV = "production";
      req.query.maintenance_bypass = "valid-bypass-token-123";

      systemStateGatekeeper(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith("maintenance_bypass_token", "valid-bypass-token-123", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("GATE-09: should allow request if valid bypass cookie already exists", () => {
      req.cookies.maintenance_bypass_token = "valid-bypass-token-123";
      systemStateGatekeeper(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it("GATE-09B: should block request if query token or cookie is invalid", () => {
      req.query.maintenance_bypass = "invalid-token";
      req.cookies.maintenance_bypass_token = "expired-token";
      
      systemStateGatekeeper(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.SERVICE_UNAVAILABLE);
    });
  });

  describe("Maintenance Enforcement Behavior", () => {
    beforeEach(() => {
      systemStateStore.get.mockReturnValue(maintenanceConfig);
    });

    it("GATE-10, 11, 12 & 13: should block and return 503 with exact SEO caching headers and metadata", () => {
      systemStateGatekeeper(req, res, next);

      expect(next).not.toHaveBeenCalled();

      // Headers check
      expect(res.set).toHaveBeenCalledWith("Retry-After", "3600");
      expect(res.set).toHaveBeenCalledWith("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

      // Status check
      expect(res.status).toHaveBeenCalledWith(StatusCodes.SERVICE_UNAVAILABLE);

      // JSON payload check
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        isMaintenance: true,
        state: "MAINTENANCE",
        meta: {
          title: "System Upgrade",
          description: "We are upgrading the database.",
          estimatedCompletion: "2026-10-10",
          supportEmail: "support@example.com",
          supportPhone: "1234567890",
          showSocialLinks: true,
          backgroundImage: "bg.jpg",
        }
      });
    });
  });
});