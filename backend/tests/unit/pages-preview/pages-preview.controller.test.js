import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as previewController from "../../../src/modules/pages-preview/pages-preview.controller.js";
import * as previewService from "../../../src/modules/pages-preview/pages-preview.service.js";

vi.mock("../../../src/modules/pages-preview/pages-preview.service.js");

const flushPromises = () => new Promise(setImmediate);

describe("Pages Preview Controller", () => {
  let req, res, next;
  let originalClientUrl;

  beforeEach(() => {
    vi.clearAllMocks();
    originalClientUrl = process.env.CLIENT_URL;

    // Express req, res, next mocks
    req = {
      params: {},
      body: {},
      user: { id: "user_123" }, // Used in createPreviewLinkController
    };

    res = {
      status: vi.fn().mockReturnThis(), // allows res.status(200).json(...)
      json: vi.fn(),
      set: vi.fn(),
    };

    next = vi.fn();
  });

  afterEach(() => {
    // Restore original env var
    process.env.CLIENT_URL = originalClientUrl;
  });

  describe("createPreviewLinkController()", () => {
    it("TC-01: should successfully create a preview link and return 201 Created", async () => {
      req.params.id = "page_1";
      process.env.CLIENT_URL = "https://frontend.example";
      
      const mockServiceResult = { previewUrl: "https://frontend.example/preview/abc123" };
      previewService.generatePreviewLink.mockResolvedValue(mockServiceResult);

      previewController.createPreviewLinkController(req, res, next);
      await flushPromises();

      expect(previewService.generatePreviewLink).toHaveBeenCalledWith(
        "page_1", 
        "user_123", 
        "https://frontend.example"
      );
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Secure preview link generated successfully.",
          meta: null,
          data: mockServiceResult
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("TC-02: should use the default frontend URL when CLIENT_URL is not configured", async () => {
      req.params.id = "page_1";
      delete process.env.CLIENT_URL; // Unset the environment variable temporarily
      
      previewService.generatePreviewLink.mockResolvedValue({ previewUrl: "fallback" });

      previewController.createPreviewLinkController(req, res, next);
      await flushPromises();

      // Check fallback to http://localhost:5173
      expect(previewService.generatePreviewLink).toHaveBeenCalledWith(
        "page_1",
        "user_123",
        "http://localhost:5173"
      );
    });

    it("TC-03: should forward service errors to next()", async () => {
      req.params.id = "page_1";
      const mockError = new Error("Service creation failed");
      previewService.generatePreviewLink.mockRejectedValue(mockError);

      previewController.createPreviewLinkController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled(); 
    });
  });

  describe("getPreviewPageDataController()", () => {
    it("TC-04 & TC-05: should set X-Robots-Tag header and successfully return preview page data", async () => {
      req.body.token = "valid_hex_token_string";
      
      const mockServiceResult = { 
        preview: { enabled: true, expiresAt: new Date() }, 
        page: { id: "page_1", title: "Draft Page" } 
      };
      previewService.resolvePreviewToken.mockResolvedValue(mockServiceResult);

      previewController.getPreviewPageDataController(req, res, next);
      await flushPromises();

      expect(previewService.resolvePreviewToken).toHaveBeenCalledWith("valid_hex_token_string");
      
      // Verification of crawler-prevention header
      expect(res.set).toHaveBeenCalledWith("X-Robots-Tag", "noindex, nofollow");
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Preview content fetched successfully.",
          data: mockServiceResult
        })
      );
    });

    it("TC-06: should forward invalid or expired token errors without sending success JSON", async () => {
      req.body.token = "invalid_token";
      const mockError = new Error("Invalid preview token.");
      previewService.resolvePreviewToken.mockRejectedValue(mockError);

      previewController.getPreviewPageDataController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.set).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("revokePreviewLinkController()", () => {
    it("TC-07: should successfully revoke the preview link and ignore service return data", async () => {
      req.params.id = "page_1";
      previewService.revokePreviewLink.mockResolvedValue({ count: 1 });

      previewController.revokePreviewLinkController(req, res, next);
      await flushPromises();

      expect(previewService.revokePreviewLink).toHaveBeenCalledWith("page_1");
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Preview link revoked successfully.",
          data: null
        })
      );
    });

    it("TC-08: should forward revocation errors to next()", async () => {
      req.params.id = "page_1";
      const mockError = new Error("Revocation failed");
      previewService.revokePreviewLink.mockRejectedValue(mockError);

      previewController.revokePreviewLinkController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getPreviewStatusController()", () => {
    it("TC-09: should return preview status successfully for an active token", async () => {
      req.params.id = "page_1";
      
      const mockActiveStatus = { 
        isActive: true, 
        expiresAt: new Date(), 
        usedCount: 5, 
        lastAccessedAt: new Date(), 
        createdAt: new Date() 
      };
      previewService.getPreviewLinkStatus.mockResolvedValue(mockActiveStatus);

      previewController.getPreviewStatusController(req, res, next);
      await flushPromises();

      expect(previewService.getPreviewLinkStatus).toHaveBeenCalledWith("page_1");
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Preview link status retrieved successfully.",
          data: mockActiveStatus
        })
      );
    });

    it("TC-10: should pass through an inactive status without modification", async () => {
      req.params.id = "page_1";
      
      const mockInactiveStatus = { isActive: false, isExpired: true };
      previewService.getPreviewLinkStatus.mockResolvedValue(mockInactiveStatus);

      previewController.getPreviewStatusController(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockInactiveStatus
        })
      );
    });

    it("TC-11: should forward status lookup errors to next()", async () => {
      req.params.id = "page_1";
      const mockError = new Error("Status check failed");
      previewService.getPreviewLinkStatus.mockRejectedValue(mockError);

      previewController.getPreviewStatusController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});