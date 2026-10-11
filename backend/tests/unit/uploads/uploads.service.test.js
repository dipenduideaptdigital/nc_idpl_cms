import { describe, it, expect, vi, beforeEach } from "vitest";
import * as uploadsService from "../../../src/modules/uploads/uploads.service.js";
import { prisma } from "../../../src/config/db.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../../src/shared/services/cloudinary.service.js";
import { processImageBuffer } from "../../../src/shared/utils/imageProcessor.js";
import { logger } from "../../../src/config/logger.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import crypto from "crypto";

// Mock dependencies
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    media: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../../../src/shared/services/cloudinary.service.js");
vi.mock("../../../src/shared/utils/imageProcessor.js");
vi.mock("../../../src/config/logger.js", () => ({
  logger: { error: vi.fn(), info: vi.fn() }
}));

describe("Uploads Service", () => {
  const userId = "user_123";
  const dummyBuffer = Buffer.from("dummy-image-data");
  const dummyHash = crypto.createHash("sha256").update(dummyBuffer).digest("hex");
  const validFile = { buffer: dummyBuffer, originalname: "test.jpg" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveUploadedFile()", () => {
    it("TC-01: should reject if file or file.buffer is missing", async () => {
      await expect(uploadsService.saveUploadedFile(undefined, userId)).rejects.toThrow(AppError);
      await expect(uploadsService.saveUploadedFile({}, userId)).rejects.toThrow(AppError);
      expect(prisma.media.create).not.toHaveBeenCalled();
      expect(processImageBuffer).not.toHaveBeenCalled();
    });

    it("TC-02: should detect duplicate by content hash and return existing active media", async () => {
      const existingMedia = { id: "media_1", fileHash: dummyHash, deletedAt: null };
      prisma.media.findUnique.mockResolvedValue(existingMedia);

      const result = await uploadsService.saveUploadedFile(validFile, userId);

      expect(prisma.media.findUnique).toHaveBeenCalledWith({ where: { fileHash: dummyHash } });
      expect(prisma.media.update).not.toHaveBeenCalled();
      expect(processImageBuffer).not.toHaveBeenCalled();
      expect(result).toEqual(existingMedia);
    });

    it("TC-03: should restore previously deleted duplicate media", async () => {
      const existingDeletedMedia = { id: "media_2", fileHash: dummyHash, deletedAt: new Date() };
      prisma.media.findUnique.mockResolvedValue(existingDeletedMedia);
      prisma.media.update.mockResolvedValue({ ...existingDeletedMedia, deletedAt: null });

      await uploadsService.saveUploadedFile(validFile, userId);

      expect(prisma.media.update).toHaveBeenCalledWith({
        where: { id: "media_2" },
        data: { deletedAt: null },
      });
      expect(processImageBuffer).not.toHaveBeenCalled();
    });

    it("TC-04 & TC-05: should upload new image successfully and generate correct thumbnail URL", async () => {
      prisma.media.findUnique.mockResolvedValue(null);
      
      const processedBufferData = {
        filename: "unique.webp",
        mainBuffer: Buffer.from("processed"),
        finalSize: 1024,
        mimeType: "image/webp",
      };
      processImageBuffer.mockResolvedValue(processedBufferData);
      
      const cloudinaryResponse = {
        secure_url: "https://res.cloudinary.com/demo/image/upload/v1600000000/main/sample.jpg",
        public_id: "main/sample"
      };
      uploadBufferToCloudinary.mockResolvedValue(cloudinaryResponse);
      
      const createdMedia = { id: "media_new", url: cloudinaryResponse.secure_url };
      prisma.media.create.mockResolvedValue(createdMedia);

      const result = await uploadsService.saveUploadedFile(validFile, userId);

      expect(processImageBuffer).toHaveBeenCalledWith(dummyBuffer, "test.jpg");
      expect(uploadBufferToCloudinary).toHaveBeenCalledWith(processedBufferData.mainBuffer, "main");
      
      const expectedThumbUrl = "https://res.cloudinary.com/demo/image/upload/c_fill,w_300,h_300,q_auto,f_auto/v1600000000/main/sample.jpg";
      
      expect(prisma.media.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fileHash: dummyHash,
            filename: "main/sample",
            originalName: "test.jpg",
            mimeType: "image/webp",
            size: 1024,
            url: cloudinaryResponse.secure_url,
            thumbnailUrl: expectedThumbUrl,
            uploadedById: userId,
          })
        })
      );
      expect(result).toEqual(createdMedia);
    });

    it("TC-06: should throw 500 if Cloudinary upload fails without DB insert", async () => {
      prisma.media.findUnique.mockResolvedValue(null);
      processImageBuffer.mockResolvedValue({ mainBuffer: Buffer.from("data") });
      uploadBufferToCloudinary.mockRejectedValue(new Error("Cloudinary timeout"));

      await expect(uploadsService.saveUploadedFile(validFile, userId)).rejects.toThrow(AppError);
      expect(prisma.media.create).not.toHaveBeenCalled();
      expect(deleteFromCloudinary).not.toHaveBeenCalled();
    });

    it("TC-07: should attempt Cloudinary cleanup and throw 500 if DB insert fails", async () => {
      prisma.media.findUnique.mockResolvedValue(null);
      processImageBuffer.mockResolvedValue({ mainBuffer: Buffer.from("data") });
      uploadBufferToCloudinary.mockResolvedValue({ secure_url: "url", public_id: "cleanup_target" });
      prisma.media.create.mockRejectedValue(new Error("DB Connection Error"));

      await expect(uploadsService.saveUploadedFile(validFile, userId)).rejects.toThrow(AppError);
      
      expect(deleteFromCloudinary).toHaveBeenCalledWith("cleanup_target");
    });

    it("TC-08: should propagate image processing error directly", async () => {
      prisma.media.findUnique.mockResolvedValue(null);
      processImageBuffer.mockRejectedValue(new Error("Sharp processing failed"));

      await expect(uploadsService.saveUploadedFile(validFile, userId)).rejects.toThrow("Sharp processing failed");
      expect(uploadBufferToCloudinary).not.toHaveBeenCalled();
    });
  });

  describe("saveMultipleFiles()", () => {
    it("TC-09: should reject an empty file list", async () => {
      await expect(uploadsService.saveMultipleFiles(undefined, userId)).rejects.toThrow(AppError);
      await expect(uploadsService.saveMultipleFiles([], userId)).rejects.toThrow(AppError);
    });

    it("TC-10: should succeed for all valid files", async () => {
      // Bypassing saveUploadedFile by mocking processImageBuffer and Cloudinary to simulate success
      prisma.media.findUnique.mockResolvedValue(null);
      processImageBuffer.mockResolvedValue({ mainBuffer: Buffer.from("data"), mimeType: "image/webp", finalSize: 100 });
      uploadBufferToCloudinary.mockResolvedValue({ secure_url: "url", public_id: "id" });
      
      prisma.media.create
        .mockResolvedValueOnce({ id: "1" })
        .mockResolvedValueOnce({ id: "2" });

      const files = [validFile, { ...validFile, originalname: "test2.jpg" }];
      const result = await uploadsService.saveMultipleFiles(files, userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual([{ id: "1" }, { id: "2" }]);
    });

    it("TC-11: should resolve successfully with partial failure, filtering nulls", async () => {
      prisma.media.findUnique.mockResolvedValue(null);
      
      // File 1 succeeds, File 2 fails processing, File 3 succeeds
      processImageBuffer
        .mockResolvedValueOnce({ mainBuffer: Buffer.from("data"), mimeType: "image/webp", finalSize: 100 }) // F1
        .mockRejectedValueOnce(new Error("Fail F2")) // F2
        .mockResolvedValueOnce({ mainBuffer: Buffer.from("data"), mimeType: "image/webp", finalSize: 100 }); // F3
        
      uploadBufferToCloudinary.mockResolvedValue({ secure_url: "url", public_id: "id" });
      prisma.media.create
        .mockResolvedValueOnce({ id: "media_1" })
        .mockResolvedValueOnce({ id: "media_3" });

      const files = [validFile, { ...validFile }, { ...validFile }];
      const result = await uploadsService.saveMultipleFiles(files, userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual([{ id: "media_1" }, { id: "media_3" }]);
      expect(logger.error).toHaveBeenCalled(); // Should log the failed file
    });

    it("TC-12: should return an empty array if all files fail", async () => {
      processImageBuffer.mockRejectedValue(new Error("Fail all"));
      
      const files = [validFile, validFile];
      const result = await uploadsService.saveMultipleFiles(files, userId);

      expect(result).toEqual([]);
      expect(logger.error).toHaveBeenCalledTimes(2);
    });
  });

  describe("getMediaList()", () => {
    it("TC-13 & TC-14: should use default pagination and calculate correctly", async () => {
      prisma.media.findMany.mockResolvedValue([]);
      prisma.media.count.mockResolvedValue(0);

      // Default
      await uploadsService.getMediaList({});
      expect(prisma.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 20, where: { deletedAt: null } })
      );

      // Custom
      const customRes = await uploadsService.getMediaList({ page: 3, limit: 10 });
      expect(prisma.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      );
      expect(customRes.meta).toEqual({ total: 0, page: 3, limit: 10, totalPages: 0 });
    });

    it("TC-15 & TC-16: should handle search by original filename and ignore blank search", async () => {
      prisma.media.findMany.mockResolvedValue([]);
      prisma.media.count.mockResolvedValue(0);

      // Valid search
      await uploadsService.getMediaList({ search: " banner " });
      expect(prisma.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, originalName: { contains: "banner" } }
        })
      );

      // Blank search
      prisma.media.findMany.mockClear();
      await uploadsService.getMediaList({ search: "   " });
      expect(prisma.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null }
        })
      );
    });

    it("TC-17 & TC-18: should sort by createdAt desc and return uploader details via Promise.all", async () => {
      const mockMedia = [{ id: "1" }];
      prisma.media.findMany.mockResolvedValue(mockMedia);
      prisma.media.count.mockResolvedValue(1);

      const result = await uploadsService.getMediaList({ page: 1, limit: 5 });

      expect(prisma.media.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "desc" },
          include: { uploadedBy: { select: { name: true, email: true } } }
        })
      );
      expect(result.media).toEqual(mockMedia);
      expect(result.meta.total).toBe(1);
    });

    it("TC-19: should propagate database failure on listing", async () => {
      prisma.media.findMany.mockRejectedValue(new Error("DB Error"));
      await expect(uploadsService.getMediaList({})).rejects.toThrow("DB Error");
    });
  });

  describe("getMediaById()", () => {
    it("TC-20: should return an existing active media record", async () => {
      const mockMedia = { id: "media_1", uploadedBy: { name: "Test" } };
      prisma.media.findUnique.mockResolvedValue(mockMedia);

      const result = await uploadsService.getMediaById("media_1");
      
      expect(prisma.media.findUnique).toHaveBeenCalledWith({
        where: { id: "media_1", deletedAt: null },
        include: { uploadedBy: { select: { name: true, email: true } } }
      });
      expect(result).toEqual(mockMedia);
    });

    it("TC-21 & TC-22: should throw 404 AppError if media does not exist or is soft-deleted", async () => {
      prisma.media.findUnique.mockResolvedValue(null); // Simulated not found / soft-deleted

      await expect(uploadsService.getMediaById("invalid_id")).rejects.toThrow(AppError);
    });
  });

  describe("deleteMediaItem()", () => {
    it("TC-23: should delete from Cloudinary and Database successfully", async () => {
      const mockMedia = { id: "media_1", filename: "cloud_id" };
      prisma.media.findUnique.mockResolvedValue(mockMedia);
      deleteFromCloudinary.mockResolvedValue();
      prisma.media.delete.mockResolvedValue({ id: "media_1" });

      const result = await uploadsService.deleteMediaItem("media_1");

      expect(deleteFromCloudinary).toHaveBeenCalledWith("cloud_id");
      expect(prisma.media.delete).toHaveBeenCalledWith({ where: { id: "media_1" } });
      expect(result).toEqual({ message: "Media deleted successfully" });
    });

    it("TC-24: should throw 404 and not attempt deletion if media not found", async () => {
      prisma.media.findUnique.mockResolvedValue(null);

      await expect(uploadsService.deleteMediaItem("invalid_id")).rejects.toThrow(AppError);
      expect(deleteFromCloudinary).not.toHaveBeenCalled();
      expect(prisma.media.delete).not.toHaveBeenCalled();
    });

    it("TC-25: should log error but proceed with DB deletion if Cloudinary deletion fails", async () => {
      const mockMedia = { id: "media_1", filename: "cloud_id" };
      prisma.media.findUnique.mockResolvedValue(mockMedia);
      deleteFromCloudinary.mockRejectedValue(new Error("Cloudinary Error"));
      prisma.media.delete.mockResolvedValue({ id: "media_1" });

      const result = await uploadsService.deleteMediaItem("media_1");

      expect(logger.error).toHaveBeenCalled();
      expect(prisma.media.delete).toHaveBeenCalledWith({ where: { id: "media_1" } });
      expect(result).toEqual({ message: "Media deleted successfully" });
    });

    it("TC-26: should skip Cloudinary deletion if filename is missing but still delete from DB", async () => {
      const mockMedia = { id: "media_1", filename: null };
      prisma.media.findUnique.mockResolvedValue(mockMedia);

      await uploadsService.deleteMediaItem("media_1");

      expect(deleteFromCloudinary).not.toHaveBeenCalled();
      expect(prisma.media.delete).toHaveBeenCalledWith({ where: { id: "media_1" } });
    });

    it("TC-27: should throw error if DB deletion fails", async () => {
      const mockMedia = { id: "media_1", filename: "cloud_id" };
      prisma.media.findUnique.mockResolvedValue(mockMedia);
      deleteFromCloudinary.mockResolvedValue();
      prisma.media.delete.mockRejectedValue(new Error("DB Delete Failed"));

      await expect(uploadsService.deleteMediaItem("media_1")).rejects.toThrow("DB Delete Failed");
    });
  });
});