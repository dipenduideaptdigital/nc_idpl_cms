import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const authorizeSystemRoles =
  (...allowedRoles) => {
    return (req, res, next) => {
      const userRole =
        req.user.systemRole.slug;

      if (
        !allowedRoles.includes(userRole)
      ) {
        throw new AppError(
          "You are not authorized to access this resource",
          StatusCodes.FORBIDDEN
        );
      }

      next();
    };
  };

export const authorizePermissions =
  (...requiredPermissions) => {
    return (req, res, next) => {
      // SUPER ADMIN BYPASS

      if (
        req.user.systemRole.slug ===
        "SUPER_ADMIN"
      ) {
        return next();
      }

      const userPermissions =
        req.user.functionalRoles.flatMap(
          (role) =>
            role.functionalRole.permissions.map(
              (permissionRelation) =>
                permissionRelation.permission
                  .slug
            )
        );

      const hasPermission =
        requiredPermissions.every(
          (permission) =>
            userPermissions.includes(
              permission
            )
        );

      if (!hasPermission) {
        throw new AppError(
          "Insufficient permissions",
          StatusCodes.FORBIDDEN
        );
      }

      next();
    };
  };