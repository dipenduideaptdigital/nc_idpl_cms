import multer from "multer";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError("Invalid file type. Only JPG, PNG, and WEBP are allowed.", StatusCodes.UNSUPPORTED_MEDIA_TYPE), 
      false
    );
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 10, 
  },
});