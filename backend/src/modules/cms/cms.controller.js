import { prisma } from "../../config/db.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

export const getHomePageSetting = asyncHandler(async (req, res) => {
  const { section } = req.params;

  const setting = await prisma.homePageSetting.findUnique({
    where: { section },
  });

  if (!setting) {
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Setting not found",
      data: {
        section,
        content: null,
      }
    });
  }

  return sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Setting retrieved successfully",
    data: setting
  });
});

export const updateHomePageSetting = asyncHandler(async (req, res) => {
  const { section } = req.params;
  const { content } = req.body;

  const setting = await prisma.homePageSetting.upsert({
    where: { section },
    update: { content },
    create: { section, content },
  });

  return sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Setting updated successfully",
    data: setting
  });
});

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "No file uploaded"
    });
  }

  // Construct URL for the uploaded file
  // In a real app with cloud storage this would be the cloud URL
  const fileUrl = `/uploads/${req.file.filename}`;

  return sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "File uploaded successfully",
    data: {
      url: fileUrl,
      filename: req.file.originalname,
    }
  });
});