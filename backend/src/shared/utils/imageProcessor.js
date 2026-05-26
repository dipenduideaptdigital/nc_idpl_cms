import sharp from "sharp";
import crypto from "crypto";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export const processImageBuffer = async (buffer, originalName) => {
  try {
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const filename = `${uniqueId}.webp`;
    const thumbFilename = `${uniqueId}-thumb.webp`;

    const mainBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true, 
      })
      .webp({ quality: 80, effort: 4 }) 
      .toBuffer({ resolveWithObject: true });

    const thumbBuffer = await sharp(buffer)
      .resize(300, 300, {
        fit: "cover",
        position: "entropy",
      })
      .webp({ quality: 60 })
      .toBuffer();

    return {
      filename,
      thumbFilename,
      mainBuffer: mainBuffer.data,
      thumbBuffer: thumbBuffer,
      finalSize: mainBuffer.info.size,
      mimeType: "image/webp",
    };
  } catch (error) {
    throw new AppError("Image processing failed", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};