import { prisma } from "../../config/db.js";
import { AppError } from "../../shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../config/logger.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../../shared/services/cloudinary.service.js";
import { processImageBuffer } from "../../shared/utils/imageProcessor.js";

export const saveUploadedFile = async (file, userId) => {
  if (!file || !file.buffer) {
    throw new AppError("No file buffer provided", StatusCodes.BAD_REQUEST);
  }

  const processed = await processImageBuffer(file.buffer, file.originalname);

  let mainUpload;
  let thumbUpload;

  try {
    mainUpload = await uploadBufferToCloudinary(processed.mainBuffer, "main");
    thumbUpload = await uploadBufferToCloudinary(processed.thumbBuffer, "thumbs");

    const media = await prisma.media.create({
      data: {
        filename: mainUpload.public_id,
        originalName: file.originalname,
        mimeType: processed.mimeType,
        size: processed.finalSize,
        url: mainUpload.secure_url,
        thumbnailUrl: thumbUpload.secure_url,
        uploadedById: userId,
      },
    });

    return media;
  } catch (error) {
    if (mainUpload?.public_id) await deleteFromCloudinary(mainUpload.public_id);
    if (thumbUpload?.public_id) await deleteFromCloudinary(thumbUpload.public_id);
    throw new AppError("Failed to save file metadata to Cloudinary or Database", StatusCodes.INTERNAL_SERVER_ERROR);
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