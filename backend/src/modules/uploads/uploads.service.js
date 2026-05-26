import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../config/logger.js";
import { saveBufferToStorage, deleteMediaFile } from "../../shared/services/storage.service.js";
import { processImageBuffer } from "../../shared/utils/imageProcessor.js";

export const saveUploadedFile = async (file, userId) => {
  if (!file || !file.buffer) {
    throw new AppError("No file buffer provided", StatusCodes.BAD_REQUEST);
  }

  const processed = await processImageBuffer(file.buffer, file.originalname);

  const mainUrl = `/uploads/${processed.filename}`;
  const thumbUrl = `/uploads/thumbs/${processed.thumbFilename}`;

  await saveBufferToStorage(processed.mainBuffer, mainUrl);
  await saveBufferToStorage(processed.thumbBuffer, thumbUrl);

  try {
    const media = await prisma.media.create({
      data: {
        filename: processed.filename,
        originalName: file.originalname,
        mimeType: processed.mimeType,
        size: processed.finalSize,
        url: mainUrl,
        thumbnailUrl: thumbUrl,
        uploadedById: userId,
      },
    });

    return media;
  } catch (error) {
    await deleteMediaFile(mainUrl);
    await deleteMediaFile(thumbUrl);
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
      logger.error(`Failed to process file ${file.originalname}`, error);
    }
  }
  return savedMedia;
};