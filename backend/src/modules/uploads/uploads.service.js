import crypto from "crypto";
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

  const fileHash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  // Check if exactly the same file already exists in the database
  const existingMedia = await prisma.media.findUnique({
    where: { fileHash }
  });

  // If duplicate found, return it immediately
  if (existingMedia) {
    if (existingMedia.deletedAt) {
      await prisma.media.update({
        where: { id: existingMedia.id },
        data: { deletedAt: null }
      });
    }
    return existingMedia;
  }

  // If new image, proceed to process and upload
  const processed = await processImageBuffer(file.buffer, file.originalname);
  
  let mainUpload;
  let thumbUpload;

  try {
    mainUpload = await uploadBufferToCloudinary(processed.mainBuffer, "main");
    thumbUpload = await uploadBufferToCloudinary(processed.thumbBuffer, "thumbs");

    const media = await prisma.media.create({
      data: {
        fileHash,
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

export const getMediaList = async (query) => {
  const { page = 1, limit = 20, search } = query;
  const skip = (page - 1) * limit;

  const where = { deletedAt: null };

  if (search) {
    where.originalName = { contains: search, mode: "insensitive" };
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { name: true, email: true } }
      }
    }),
    prisma.media.count({ where })
  ]);

  return {
    media,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

export const getMediaById = async (id) => {
  const media = await prisma.media.findUnique({
    where: { id, deletedAt: null },
    include: { uploadedBy: { select: { name: true, email: true } } }
  });

  if (!media) throw new AppError("Media not found", StatusCodes.NOT_FOUND);
  return media;
};

export const deleteMediaItem = async (id) => {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          featuredInPages: true,
          featuredInBlogs: true,
          featuredInProjects: true,
          ogImageForPages: true,
          ogImageForBlogs: true,
        }
      }
    }
  });

  if (!media) {
    throw new AppError("Media not found.", StatusCodes.NOT_FOUND);
  }

  const usageCount = 
    media._count.featuredInPages + 
    media._count.featuredInBlogs + 
    media._count.featuredInProjects + 
    media._count.ogImageForPages + 
    media._count.ogImageForBlogs;

  if (usageCount > 0) {
    throw new AppError(
      `Cannot delete: This image is currently being used in ${usageCount} place(s) (Pages/Blogs/Projects). Please remove it from there first.`, 
      StatusCodes.CONFLICT
    );
  }

  try {
    if (media.filename) {
      await deleteFromCloudinary(media.filename);
    
      const thumbPublicId = media.filename.replace("main/", "thumbs/").replace(".webp", "-thumb.webp");
      await deleteFromCloudinary(thumbPublicId);
    }
  } catch (error) {
    logger.error(`Cloudinary deletion failed for ${id}. Proceeding to DB deletion.`, error);
  }

  await prisma.media.delete({ where: { id } });

  return { message: "Media deleted successfully." };
};