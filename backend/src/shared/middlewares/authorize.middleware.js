import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";

export const authorizeSystemRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.systemRole?.slug;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new AppError(
          "You are not authorized to access this resource",
          StatusCodes.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};