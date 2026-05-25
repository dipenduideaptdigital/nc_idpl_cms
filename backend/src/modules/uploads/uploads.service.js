import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import fs from "fs/promises";
import { logger } from "../../config/logger.js";

const cleanupFile = async (filepath) => {
  try {
    await fs.unlink(filepath);
  } catch (error) {
    logger.error(`Failed to cleanup orphaned file: ${filepath}`, error);
  }
};

export const saveUploadedFile = async (file, userId) => {
  if (!file) {
    throw new AppError("No file provided", StatusCodes.BAD_REQUEST);
  }

  const fileUrl = `/uploads/${file.filename}`;

  try {
    const media = await prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedById: userId,
      },
    });

    return media;
  } catch (error) {
    await cleanupFile(file.path);
    throw new AppError("Failed to save file metadata", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const saveMultipleFiles = async (files, userId) => {
  if (!files || files.length === 0) {
    throw new AppError("No files provided", StatusCodes.BAD_REQUEST);
  }

  const savedMedia = [];
  
  for (const file of files) {
    try {
      const media = await saveUploadedFile(file, userId);
      savedMedia.push(media);
    } catch (error) {
      logger.error(`Failed to process file ${file.originalname}`);
    }
  }

  return savedMedia;
};