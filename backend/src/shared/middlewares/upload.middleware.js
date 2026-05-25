import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// MIME Type checking (Only Images for CMS)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.", StatusCodes.UNSUPPORTED_MEDIA_TYPE), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 5, 
  },
});