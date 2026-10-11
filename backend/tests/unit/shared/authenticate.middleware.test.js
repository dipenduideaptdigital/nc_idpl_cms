import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { authenticate } from "../../../src/shared/middlewares/authenticate.middleware.js";
import * as jwtUtils from "../../../src/shared/utils/jwt.js";
import * as tokenUtils from "../../../src/shared/utils/extractToken.js";
import * as authRepo from "../../../src/modules/auth/auth.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mock dependencies
vi.mock("../../../src/shared/utils/jwt.js");
vi.mock("../../../src/shared/utils/extractToken.js");
vi.mock("../../../src/modules/auth/auth.repository.js");

describe("Authenticate Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { headers: {} };
    res = {};
    next = vi.fn();
  });

  // Authorization header & token extraction
  describe("A. Token Extraction", () => {
    it.each([
      ["AUTH-01", undefined, "missing header"],
      ["AUTH-02", "", "empty string"],
      ["AUTH-03", "Basic abc123", "wrong scheme"],
      ["AUTH-04", "Bearer", "only Bearer word"],
      ["AUTH-05", "Bearer abc extra", "malformed format"],
    ])("%s: should reject with 401 when header is %s", async (testId, authHeader, desc) => {
      req.headers.authorization = authHeader;
      tokenUtils.extractBearerToken.mockReturnValue(null);

      await authenticate(req, res, next);

      expect(tokenUtils.extractBearerToken).toHaveBeenCalledWith(authHeader);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(next.mock.calls[0][0].message).toBe("Access token missing");
      expect(jwtUtils.verifyAccessToken).not.toHaveBeenCalled(); // AUTH-03, AUTH-04 validation
    });

    it("AUTH-06: should pass valid token to verification helper", async () => {
      req.headers.authorization = "Bearer test-token";
      tokenUtils.extractBearerToken.mockReturnValue("test-token");
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "u1" });
      authRepo.findUserById.mockResolvedValue({ id: "u1", status: "ACTIVE" });

      await authenticate(req, res, next);

      expect(jwtUtils.verifyAccessToken).toHaveBeenCalledWith("test-token");
    });
  });

  // Access-token verification
  describe("B. Token Verification", () => {
    it.each([
      ["AUTH-07", "invalid signature"],
      ["AUTH-08", "jwt expired"],
    ])("%s: should reject with 401 on %s", async (testId, errorReason) => {
      req.headers.authorization = "Bearer bad-token";
      tokenUtils.extractBearerToken.mockReturnValue("bad-token");
      jwtUtils.verifyAccessToken.mockImplementation(() => {
        throw new Error(errorReason);
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(error.message).toBe("Invalid or expired token");
      expect(authRepo.findUserById).not.toHaveBeenCalled(); // AUTH-09 validation
    });

    it("AUTH-10: should call findUserById with decoded userId", async () => {
      req.headers.authorization = "Bearer valid-token";
      tokenUtils.extractBearerToken.mockReturnValue("valid-token");
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_123" });
      authRepo.findUserById.mockResolvedValue({ id: "user_123", status: "ACTIVE" });

      await authenticate(req, res, next);

      expect(authRepo.findUserById).toHaveBeenCalledWith("user_123");
    });
  });

  // User existence and status
  describe("C. User Status Validation", () => {
    beforeEach(() => {
      req.headers.authorization = "Bearer token";
      tokenUtils.extractBearerToken.mockReturnValue("token");
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_123" });
    });

    it("AUTH-11: should reject 401 if user no longer exists", async () => {
      authRepo.findUserById.mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(next.mock.calls[0][0].message).toBe("User no longer exists");
    });

    it.each([
      ["AUTH-12", "INACTIVE"],
      ["AUTH-13", "SUSPENDED"],
      ["AUTH-14", "PENDING"],
    ])("%s: should reject 403 if user status is %s", async (testId, status) => {
      authRepo.findUserById.mockResolvedValue({ id: "user_123", status });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(next.mock.calls[0][0].message).toBe("Account is not active");
    });

    it("AUTH-15: should allow authentication for ACTIVE users", async () => {
      authRepo.findUserById.mockResolvedValue({ id: "user_123", status: "ACTIVE" });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(); // Called without error
    });
  });

  // req.user creation & permissions
  describe("D. req.user payload mapping", () => {
    const dbUser = { id: "user_1", status: "ACTIVE", email: "test@ex.com" };

    beforeEach(() => {
      req.headers.authorization = "Bearer token";
      tokenUtils.extractBearerToken.mockReturnValue("token");
      authRepo.findUserById.mockResolvedValue(dbUser);
    });

    it("AUTH-16: should attach db user fields and token permissions to req.user", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1", permissions: ["read", "write"] });

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe("user_1");
      expect(req.user.email).toBe("test@ex.com");
      expect(req.user.permissions).toEqual(["read", "write"]);
    });

    it("AUTH-17: should default to empty array if token has no permissions", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1" }); // permissions omitted

      await authenticate(req, res, next);

      expect(req.user.permissions).toEqual([]);
    });

    it("AUTH-18: should retain empty permissions array from token", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1", permissions: [] });

      await authenticate(req, res, next);

      expect(req.user.permissions).toEqual([]);
    });

    it("AUTH-19: should overwrite DB permissions with token permissions", async () => {
      // User from DB happens to have permissions attached (e.g., loaded by mistake)
      authRepo.findUserById.mockResolvedValue({ ...dbUser, permissions: ["db_perm"] });
      // Token has different permissions
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1", permissions: ["token_perm"] });

      await authenticate(req, res, next);

      expect(req.user.permissions).toEqual(["token_perm"]);
    });

    it("AUTH-20: should call next() exactly once without error on success", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1", permissions: ["read"] });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // No arguments means success
    });
  });

  // Dependency failures and malformed payloads
  describe("E. Errors and Malformed Payloads", () => {
    beforeEach(() => {
      req.headers.authorization = "Bearer token";
      tokenUtils.extractBearerToken.mockReturnValue("token");
    });

    it("AUTH-21: should forward raw DB error from findUserById to next()", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1" });
      const dbError = new Error("Database connection lost");
      authRepo.findUserById.mockRejectedValue(dbError);

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(dbError);
    });

    it("AUTH-22: should abstract internal verification errors to standard AppError", async () => {
      jwtUtils.verifyAccessToken.mockImplementation(() => {
        throw new Error("Internal Secret Key Missing"); // Sensitive internal error
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Invalid or expired token");
      expect(error.message).not.toContain("Secret Key Missing");
    });

    it("AUTH-23: should reject token missing userId inside payload and NOT call DB", async () => {
      jwtUtils.verifyAccessToken.mockReturnValue({ role: "ADMIN" }); // Valid token, but no userId

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toBe("Invalid or expired token");
      expect(authRepo.findUserById).not.toHaveBeenCalled();
    });

    it("AUTH-24: should normalize non-array permissions from payload safely", async () => {
      // Attacker injected a string instead of an array
      jwtUtils.verifyAccessToken.mockReturnValue({ userId: "user_1", permissions: "admin,superuser" });
      authRepo.findUserById.mockResolvedValue({ id: "user_1", status: "ACTIVE" });

      await authenticate(req, res, next);

      expect(req.user.permissions).toEqual([]); // Normalized to empty array
      expect(next).toHaveBeenCalledWith();
    });
  });
});