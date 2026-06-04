import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import { findPageById } from "./pages.repository.js";
import * as pagesService from "./pages.service.js";

// ADMINISTRATIVE PANEL CONTROLLERS 

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

export const getAdminPageTreeController = asyncHandler(async (req, res) => {
  const tree = await pagesService.getAdminPageTree();
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Admin page tree retrieved successfully", 
    data: tree 
  });
});

export const getAdminPageByIdController = asyncHandler(async (req, res) => {
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


export const getPageRevisionsController = asyncHandler(async (req, res) => {
  const history = await pagesService.getPageRevisionsList(req.params.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Historical structural state mutation list fetched successfully",
    data: history,
  });
});

export const getSingleRevisionSnapshotController = asyncHandler(async (req, res) => {
  const revision = await pagesService.getSinglePageRevision(req.params.id, req.params.revisionId);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Precise historical state snapshot extracted successfully",
    data: revision,
  });
});

export const restoreRevisionSnapshotController = asyncHandler(async (req, res) => {
  const restoredVersion = await pagesService.restorePageToRevision(
    req.params.id, 
    req.params.revisionId, 
    req.user.id
  );
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "System data transaction rollback process completed successfully. Target version state running live.",
    data: restoredVersion,
  });
});

export const getPublicPagesFlatCollectionController = asyncHandler(async (req, res) => {
  const queryOverrides = { ...req.query, status: "PUBLISHED" };
  const matrixResult = await pagesService.getPagesList(queryOverrides);
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Public production pages collection list compiled safely tracking metrics parameters configurations mapping checks.", 
    data: matrixResult.data, 
    meta: matrixResult.meta 
  });
});

export const getPublicMenuTreeController = asyncHandler(async (req, res) => {
  const tree = await pagesService.getPublicMenuTree();
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Public menu tree retrieved successfully", 
    data: tree 
  });
});

export const getPublicPageController = asyncHandler(async (req, res) => {
  const fullPath = req.path;
  const page = await pagesService.getPublicPageByPath(fullPath);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page retrieved successfully",
    data: page, 
  });
});