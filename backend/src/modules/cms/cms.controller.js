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
  if (!Object.hasOwn(CMS_REGISTRY, sectionKey)) {
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
  const actorUserId = req.user?.id; // Get the admin who is making the change safely

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
  
  if (!keysParam || typeof keysParam !== "string" || keysParam.trim() === "") {
    throw new AppError("Keys parameter is required and must be a comma-separated string", StatusCodes.BAD_REQUEST);
  }
  
  const keysArray = keysParam.split(',').map(key => key.trim());
  
  // Validate all extracted keys against the registry and drop empty keys
  const invalidKeys = keysArray.filter(key => key === "" || !Object.hasOwn(CMS_REGISTRY, key));
  if (invalidKeys.length > 0) {
    throw new AppError(`Invalid or unregistered CMS section keys detected.`, StatusCodes.BAD_REQUEST);
  }
  
  const data = await getMultipleHomepageSections(keysArray);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Fetched multiple CMS sections successfully",
    data,
  });
});