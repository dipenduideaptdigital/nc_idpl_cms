import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as previewService from "./pages-preview.service.js";

export const createPreviewLinkController = asyncHandler(async (req, res) => {
  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const result = await previewService.generatePreviewLink(req.params.id, req.user.id, frontendUrl);

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Secure preview link generated successfully.",
    data: result
  });
});

export const getPreviewPageDataController = asyncHandler(async (req, res) => {
  const pageData = await previewService.resolvePreviewToken(req.body.token);
  res.set("X-Robots-Tag", "noindex, nofollow");
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Preview content fetched successfully.",
    data: pageData 
  });
});

export const revokePreviewLinkController = asyncHandler(async (req, res) => {
  await previewService.revokePreviewLink(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Preview link revoked successfully." });
});


export const getPreviewStatusController = asyncHandler(async (req, res) => {
  const status = await previewService.getPreviewLinkStatus(req.params.id);
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Preview link status retrieved successfully.",
    data: status 
  });
});