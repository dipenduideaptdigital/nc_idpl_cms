import { describe, it, expect, vi, beforeEach } from "vitest";
import * as controller from "../../../src/modules/uploads/uploads.controller.js";
import * as service from "../../../src/modules/uploads/uploads.service.js";
import { sendResponse } from "../../../src/shared/utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

// Mocking dependencies
vi.mock("../../../src/modules/uploads/uploads.service.js");
vi.mock("../../../src/shared/utils/apiResponse.js");

const flushPromises = () => new Promise(process.nextTick);

describe("Uploads Controller", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      file: { buffer: Buffer.from("dummy"), originalname: "test.jpg" },
      files: [{ buffer: Buffer.from("dummy1") }, { buffer: Buffer.from("dummy2") }],
      user: { id: "user_123" },
      query: {},
      params: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
  });

  describe("uploadSingleImageController", () => {
    it("UC-01 & UC-02: should pass correct arguments to service and return 201 with data on success", async () => {
      const mockResult = { id: "media_1", url: "http://example.com/img.jpg" };
      service.saveUploadedFile.mockResolvedValue(mockResult);

      controller.uploadSingleImageController(req, res, next);
      await flushPromises();

      expect(service.saveUploadedFile).toHaveBeenCalledWith(req.file, req.user.id);
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.CREATED,
          message: "Image uploaded successfully",
          data: mockResult
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("UC-09, UC-10 & UC-11: should forward error to next() and not call sendResponse on service failure", async () => {
      const mockError = new Error("Upload failed");
      service.saveUploadedFile.mockRejectedValue(mockError);

      controller.uploadSingleImageController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("uploadMultipleImagesController", () => {
    it("UC-03 & UC-04: should pass files and userId to service and return 201 array result", async () => {
      const mockResult = [{ id: "m1" }, { id: "m2" }];
      service.saveMultipleFiles.mockResolvedValue(mockResult);

      controller.uploadMultipleImagesController(req, res, next);
      await flushPromises();

      expect(service.saveMultipleFiles).toHaveBeenCalledWith(req.files, req.user.id);
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.CREATED,
          message: "Images uploaded successfully",
          data: mockResult
        })
      );
    });

    it("UC-12: should return 201 even if service returns an empty array (partial failure edge case)", async () => {
      service.saveMultipleFiles.mockResolvedValue([]); // Service failed all uploads but caught them

      controller.uploadMultipleImagesController(req, res, next);
      await flushPromises();

      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.CREATED,
          data: []
        })
      );
    });

    it("should forward structural errors to next()", async () => {
      const mockError = new Error("Internal processing error");
      service.saveMultipleFiles.mockRejectedValue(mockError);

      controller.uploadMultipleImagesController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("getAllMediaController", () => {
    it("UC-05 & UC-06: should pass req.query to service and return split data and meta", async () => {
      req.query = { page: "2", limit: "10" };
      const mockServiceResponse = {
        media: [{ id: "m1" }, { id: "m2" }],
        meta: { total: 2, page: 2, limit: 10, totalPages: 1 }
      };
      service.getMediaList.mockResolvedValue(mockServiceResponse);

      controller.getAllMediaController(req, res, next);
      await flushPromises();

      expect(service.getMediaList).toHaveBeenCalledWith(req.query);
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.OK,
          message: "Media library fetched successfully",
          data: mockServiceResponse.media,
          meta: mockServiceResponse.meta
        })
      );
    });

    it("should forward errors to next()", async () => {
      service.getMediaList.mockRejectedValue(new Error("DB Error"));

      controller.getAllMediaController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("getMediaByIdController", () => {
    it("UC-07: should pass req.params.id and return standard 200 response with data", async () => {
      req.params.id = "media_123";
      const mockMedia = { id: "media_123", url: "xyz.jpg" };
      service.getMediaById.mockResolvedValue(mockMedia);

      controller.getMediaByIdController(req, res, next);
      await flushPromises();

      expect(service.getMediaById).toHaveBeenCalledWith("media_123");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.OK,
          message: "Media details fetched",
          data: mockMedia
        })
      );
    });

    it("should forward AppError(404) to next() if service rejects", async () => {
      req.params.id = "invalid_id";
      const mockError = new Error("Media not found");
      service.getMediaById.mockRejectedValue(mockError);

      controller.getMediaByIdController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalledWith(mockError);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("deleteMediaController", () => {
    it("UC-08: should pass req.params.id and send customized success message", async () => {
      req.params.id = "media_123";
      // Service resolves successfully (it might return a message, but controller ignores it)
      service.deleteMediaItem.mockResolvedValue({ message: "Internal message" });

      controller.deleteMediaController(req, res, next);
      await flushPromises();

      expect(service.deleteMediaItem).toHaveBeenCalledWith("media_123");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.OK,
          message: "Media deleted successfully"
        })
      );
      
      expect(sendResponse.mock.calls[0][0].data).toBeUndefined();
    });

    it("should forward errors to next() if deletion fails", async () => {
      req.params.id = "media_123";
      service.deleteMediaItem.mockRejectedValue(new Error("Deletion failed"));

      controller.deleteMediaController(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});