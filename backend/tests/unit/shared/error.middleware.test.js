// tests/unit/shared/error.middleware.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { globalErrorHandler } from "../../../src/shared/middlewares/error.middleware.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

describe("Error Middleware", () => {
  let err, req, res, next;
  let originalNodeEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    
    originalNodeEnv = process.env.NODE_ENV;
    
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("ERR-01: should return custom statusCode and message if provided (e.g., AppError)", () => {
    err = new AppError("Invalid user input", StatusCodes.BAD_REQUEST);
    
    globalErrorHandler(err, req, res, next);
    
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Invalid user input"
    }));
  });

  it("ERR-02: should default to 500 INTERNAL_SERVER_ERROR if no statusCode is provided", () => {
    err = new Error("Database connection lost");
    
    globalErrorHandler(err, req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Database connection lost"
    }));
  });

  it("ERR-03: should fallback to 'Something went wrong' if error message is empty", () => {
    err = { statusCode: StatusCodes.FORBIDDEN }; // message missing
    
    globalErrorHandler(err, req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Something went wrong"
    }));
  });

  it("ERR-04: should expose stack trace in development mode", () => {
    process.env.NODE_ENV = "development";
    err = new Error("Dev mode error");
    err.stack = "Error stack trace details...";
    
    globalErrorHandler(err, req, res, next);
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Dev mode error",
      stack: "Error stack trace details..."
    }));
  });

  it("ERR-05: should NOT expose stack trace in production mode to prevent information leakage", () => {
    process.env.NODE_ENV = "production";
    err = new Error("Prod mode error");
    err.stack = "Secret stack trace details...";
    
    globalErrorHandler(err, req, res, next);
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Prod mode error",
      stack: undefined
    }));
  });
});