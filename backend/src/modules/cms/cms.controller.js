import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { getHomepageSection, updateHomepageSection, getMultipleHomepageSections } from "./cms.service.js";
import { CMS_REGISTRY } from "./cms.registry.js";
import { AppError } from "../../shared/errors/AppError.js";

// Fetch Dynamic Section
export const getDynamicSectionController = asyncHandler(async (req, res) => {
  const { sectionKey } = req.params;

  // Validate if someone is trying to fetch an unregistered/invalid key
  if (!CMS_REGISTRY[sectionKey]) {
    throw new AppError("CMS section not found", StatusCodes.NOT_FOUND);
  }

  const data = await getHomepageSection(sectionKey);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: `Fetched ${sectionKey} successfully`,
    data,
  });
});

// Update Dynamic Section
export const updateDynamicSectionController = asyncHandler(async (req, res) => {
  const { sectionKey } = req.params;
  const { content } = req.body;
  const actorUserId = req.user.id; // Get the admin who is making the change

  // Pass actorUserId to the service
  const data = await updateHomepageSection(sectionKey, { content }, actorUserId);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: `Updated ${sectionKey} successfully`,
    data,
  });
});

// Fetch Multiple Dynamic Sections at once
export const getMultipleDynamicSectionsController = asyncHandler(async (req, res) => {
  const keysParam = req.query.keys;
  
  if (!keysParam) {
    throw new AppError("Keys parameter is required (comma separated)", StatusCodes.BAD_REQUEST);
  }

  const keysArray = keysParam.split(',').map(key => key.trim());
  const data = await getMultipleHomepageSections(keysArray);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Fetched multiple CMS sections successfully",
    data,
  });
});