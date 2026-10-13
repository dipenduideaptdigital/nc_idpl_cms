import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { uploadImage } from "../../../src/shared/middlewares/upload.middleware.js";

describe("Upload Middleware", () => {
  let app;

  beforeEach(() => {
    app = express();

    app.post("/upload-single", uploadImage.single("image"), (req, res) => {
      res.status(StatusCodes.OK).json({ success: true, file: req.file });
    });

    app.post("/upload-multiple", uploadImage.array("images", 50), (req, res) => {
      res.status(StatusCodes.OK).json({ success: true, files: req.files });
    });

    app.use((err, req, res, next) => {
      const statusCode = err.statusCode || (err.code === "LIMIT_FILE_SIZE" ? StatusCodes.REQUEST_TOO_LONG : StatusCodes.INTERNAL_SERVER_ERROR);
      
      res.status(statusCode).json({
        success: false,
        message: err.message,
        code: err.code
      });
    });
  });

  describe("File Filter Logic (MIME Types)", () => {
    it("should accept valid JPEG image types", async () => {
      const dummyBuffer = Buffer.from("fake jpeg data");
      
      const res = await request(app)
        .post("/upload-single")
        .attach("image", dummyBuffer, { filename: "test.jpg", contentType: "image/jpeg" });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.file).toBeDefined();
      expect(res.body.file.mimetype).toBe("image/jpeg");
    });

    it("should accept valid PNG image types", async () => {
      const dummyBuffer = Buffer.from("fake png data");
      
      const res = await request(app)
        .post("/upload-single")
        .attach("image", dummyBuffer, { filename: "test.png", contentType: "image/png" });

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.file.mimetype).toBe("image/png");
    });

    it("should reject invalid file types (e.g., PDF) with 415 status", async () => {
      const dummyBuffer = Buffer.from("fake pdf data");
      
      const res = await request(app)
        .post("/upload-single")
        .attach("image", dummyBuffer, { filename: "document.pdf", contentType: "application/pdf" });

      expect(res.status).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE); 
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
    });
  });

  describe("File Size Limits", () => {
    it("should reject files larger than 10MB", async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024, "a");
      
      const res = await request(app)
        .post("/upload-single")
        .attach("image", largeBuffer, { filename: "large.jpg", contentType: "image/jpeg" });

      expect(res.status).toBe(StatusCodes.REQUEST_TOO_LONG); 
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe("LIMIT_FILE_SIZE");
      expect(res.body.message).toBe("File too large");
    });
  });
});