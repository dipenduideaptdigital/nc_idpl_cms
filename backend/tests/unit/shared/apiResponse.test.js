import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendResponse } from "../../../src/shared/utils/apiResponse.js";

describe("apiResponse Utility", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue("mocked_return_value"),
    };
  });

  describe("sendResponse()", () => {
    it("1. should return a default response when only 'res' is provided", () => {
      sendResponse({ res: mockRes });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Success",
        meta: null,
        data: null,
      });
    });

    it("2. should return a custom success response", () => {
      sendResponse({
        res: mockRes,
        statusCode: 201,
        message: "Created",
        data: { id: 1 },
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Created",
        meta: null,
        data: { id: 1 },
      });
    });

    it("3. should return a failure/error response with default null for data/meta", () => {
      sendResponse({
        res: mockRes,
        statusCode: 400,
        success: false,
        message: "Invalid request",
      });

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid request",
        meta: null,
        data: null,
      });
    });

    it("4. should preserve and return the meta object correctly", () => {
      const customMeta = { page: 1, limit: 10, total: 25 };
      sendResponse({
        res: mockRes,
        meta: customMeta,
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Success",
        meta: customMeta,
        data: null,
      });
    });

    it("5. should preserve and return the return value of res.json()", () => {
      const result = sendResponse({ res: mockRes });
      
      expect(result).toBe("mocked_return_value");
    });
  });
});