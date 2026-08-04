// shared/utils/imageProcessor.js
import sharp from "sharp";
import crypto from "crypto";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export const processImageBuffer = async (buffer, originalName) => {
  try {
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const filename = `${uniqueId}.webp`;

    const mainBuffer = await sharp(buffer)
      .resize(2560, 2560, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .withMetadata()
      .webp({
        quality: 80,
        effort: 4
      })
      .toBuffer({ resolveWithObject: true });

    return {
      filename,
      mainBuffer: mainBuffer.data,
      finalSize: mainBuffer.info.size,
      mimeType: "image/webp",
    };
  } catch (error) {
    throw new AppError("Image processing failed", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};