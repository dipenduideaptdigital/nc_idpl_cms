import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const authorizeSystemRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.systemRole.slug;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError(
        "You are not authorized to access this resource",
        StatusCodes.FORBIDDEN
      );
    }

    next();
  };
};