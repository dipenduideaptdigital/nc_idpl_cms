// tests/unit/shared/authorize.middleware.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { authorizeSystemRoles } from "../../../src/shared/middlewares/authorize.middleware.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

describe("Authorize Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { user: { systemRole: { slug: "USER" } } };
    res = {};
    next = vi.fn();
  });

  it("AUTHZ-01: should allow access if user's role exactly matches the allowed role", () => {
    req.user.systemRole.slug = "ADMIN";
    const middleware = authorizeSystemRoles("ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Called without arguments (Success)
  });

  it("AUTHZ-02: should allow access if user's role is within multiple allowed roles", () => {
    req.user.systemRole.slug = "SUPER_ADMIN";
    const middleware = authorizeSystemRoles("SUPER_ADMIN", "ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("AUTHZ-03: should reject with 403 AppError if user's role is NOT in the allowlist", () => {
    req.user.systemRole.slug = "USER";
    const middleware = authorizeSystemRoles("SUPER_ADMIN", "ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(error.message).toBe("You are not authorized to access this resource");
  });

  it("AUTHZ-04: should gracefully reject with 403 instead of crashing if req.user is undefined", () => {
    req.user = undefined; // Missing authentication context
    const middleware = authorizeSystemRoles("ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  it("AUTHZ-05: should gracefully reject with 403 if req.user.systemRole is undefined", () => {
    req.user = { name: "Incomplete User" }; // Missing systemRole
    const middleware = authorizeSystemRoles("ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.FORBIDDEN);
  });
});