import { describe, it, expect, vi, beforeEach } from "vitest";
import { notFoundHandler } from "../../../src/shared/middlewares/notFound.middleware.js";

describe("Not Found Middleware", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    
    req = {
      originalUrl: "/api/v1/unknown-hacked-route"
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it("NF-01 & NF-02: should return 404 status and exact failure JSON message containing the original URL", () => {
    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route not found: /api/v1/unknown-hacked-route"
    });
  });
});