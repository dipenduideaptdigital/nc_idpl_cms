import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { saveUploadedFile, saveMultipleFiles } from "./uploads.service.js";

export const uploadSingleImageController = asyncHandler(async (req, res) => {
  const result = await saveUploadedFile(req.file, req.user.id);

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Image uploaded successfully",
    data: result,
  });
});

export const uploadMultipleImagesController = asyncHandler(async (req, res) => {
  const result = await saveMultipleFiles(req.files, req.user.id);

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Images uploaded successfully",
    data: result,
  });
});