import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { saveUploadedFile, saveMultipleFiles, getMediaList, getMediaById, deleteMediaItem } from "./uploads.service.js";

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

export const getAllMediaController = asyncHandler(async (req, res) => {
  const result = await getMediaList(req.query);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Media library fetched successfully",
    data: result.media,
    meta: result.meta
  });
});

export const getMediaByIdController = asyncHandler(async (req, res) => {
  const media = await getMediaById(req.params.id);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Media details fetched",
    data: media
  });
});

export const deleteMediaController = asyncHandler(async (req, res) => {
  await deleteMediaItem(req.params.id);
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Media deleted successfully"
  });
});