import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { requirePermission } from "../../../src/shared/middlewares/permission.middleware.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

describe("Permission Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      user: {
        systemRole: { slug: "ADMIN" },
        permissions: ["blog.create", "blog.edit"],
      },
    };
    res = {};
    next = vi.fn();
  });

  it("PERM-01: should reject with 401 AppError if req.user is completely missing", () => {
    req.user = undefined;
    const middleware = requirePermission("blog.create");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(error.message).toContain("Authentication required");
  });

  it("PERM-02: should bypass permission check completely if systemRole is a string 'SUPER_ADMIN'", () => {
    req.user.systemRole = "SUPER_ADMIN";
    req.user.permissions = []; // No permissions at all
    const middleware = requirePermission("blog.delete");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Success
  });

  it("PERM-03: should bypass permission check completely if systemRole.slug is 'SUPER_ADMIN'", () => {
    req.user.systemRole = { slug: "SUPER_ADMIN" };
    req.user.permissions = ["some.other.perm"];
    const middleware = requirePermission("system.nuke"); // Permission they technically don't have in array

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Success
  });

  it("PERM-04: should allow access if user has the exactly required permission", () => {
    const middleware = requirePermission("blog.edit");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Success
  });

  it("PERM-05: should reject with 403 AppError if user lacks the specific permission", () => {
    const middleware = requirePermission("blog.delete"); // User only has create/edit

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(error.message).toContain("Action restricted. You lack the necessary authorization");
    expect(error.message).toContain("[blog.delete]");
  });

  it("PERM-06: should reject with 403 if user.permissions is empty or missing", () => {
    req.user.permissions = undefined; // Missing array
    const middleware = requirePermission("blog.view");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(StatusCodes.FORBIDDEN);
  });

  it("PERM-07: should correctly process duplicate permissions in the array using Set and allow access", () => {
    req.user.permissions = ["blog.view", "blog.edit", "blog.view"]; // Duplicates exist
    const middleware = requirePermission("blog.view");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Success
  });
});