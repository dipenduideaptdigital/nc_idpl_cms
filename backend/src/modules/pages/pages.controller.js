import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import { findPageById } from "./pages.repository.js";
import * as pagesService from "./pages.service.js";


export const createPageController = asyncHandler(async (req, res) => {
  const page = await pagesService.createNewPage(req.body, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Page created successfully",
    data: page,
  });
});

export const getAdminPagesListController = asyncHandler(async (req, res) => {
  const result = await pagesService.getPagesList(req.query);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Pages retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const getAdminPageByIdController = asyncHandler(async (req, res) => {
  // Simple read bypassing the service layer as no business logic is required
  const page = await findPageById(req.params.id);
  if (!page) throw new AppError("Page not found", StatusCodes.NOT_FOUND);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page retrieved successfully",
    data: serializePage(page, "admin"),
  });
});

export const updatePageController = asyncHandler(async (req, res) => {
  const page = await pagesService.updateExistingPage(req.params.id, req.body, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page updated successfully",
    data: page,
  });
});

export const duplicatePageController = asyncHandler(async (req, res) => {
  const page = await pagesService.duplicatePage(req.params.id, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Page duplicated successfully",
    data: page,
  });
});

export const deletePageController = asyncHandler(async (req, res) => {
  await pagesService.deletePage(req.params.id, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page archived successfully",
  });
});


export const getPublicPageController = asyncHandler(async (req, res) => {
  const page = await pagesService.getPublicPageBySlug(req.params.slug);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page retrieved successfully",
    data: page,
  });
});