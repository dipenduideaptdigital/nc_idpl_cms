import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw new AppError("Authentication required. Token missing or invalid.", StatusCodes.UNAUTHORIZED);
      }

      const systemRoleSlug = typeof user.systemRole === 'string' ? user.systemRole : user.systemRole?.slug;

      // SUPER_ADMIN Absolute Bypass
      if (systemRoleSlug === "SUPER_ADMIN") {
        return next();
      }

      // Extract embedded permissions from JWT
      const userPermissions = user.permissions || [];

      //  O(1) Set Check
      const permissionsSet = new Set(userPermissions);

      if (permissionsSet.has(requiredPermission)) {
        return next();
      }

      // Access Denied Fallback
      throw new AppError(
        `Action restricted. You lack the necessary authorization module clearance: [${requiredPermission}]`, 
        StatusCodes.FORBIDDEN
      );

    } catch (error) {
      next(error);
    }
  };
};