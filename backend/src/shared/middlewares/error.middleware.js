import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};