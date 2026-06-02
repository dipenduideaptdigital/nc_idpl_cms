import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import { findPageById } from "./pages.repository.js";
import * as pagesService from "./pages.service.js";

// ADMINISTRATIVE PANEL CONTROLLERS 

// Materializes a newly designed block-based headless content workspace
 
export const createPageController = asyncHandler(async (req, res) => {
  const page = await pagesService.createNewPage(req.body, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Page created successfully",
    data: page,
  });
});

// Extracts filterable multi-column matrices supporting complex pagination limits
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

// Combines flat system directories into recursive layout node hierarchies in memory
export const getAdminPageTreeController = asyncHandler(async (req, res) => {
  const tree = await pagesService.getAdminPageTree();
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Admin page tree retrieved successfully", 
    data: tree 
  });
});

// Extracts a complete structural layout record using its transactional identity identifier
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

// Mutates runtime definitions and triggers cascade fullPath upgrades if layout nodes move
export const updatePageController = asyncHandler(async (req, res) => {
  const page = await pagesService.updateExistingPage(req.params.id, req.body, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page updated successfully",
    data: page,
  });
});

// Recursively deep-clones a parent node along with its entire downstream branch ecosystem
export const duplicatePageController = asyncHandler(async (req, res) => {
  const page = await pagesService.duplicatePage(req.params.id, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Page duplicated successfully",
    data: page,
  });
});

// Enforces rigid structural blockades ensuring parent layout containers aren't orphaned
export const deletePageController = asyncHandler(async (req, res) => {
  await pagesService.deletePage(req.params.id, req.user.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Page archived successfully",
  });
});

// REVISION SUBSYSTEM CONTROLLERS (VERSION CONTROL SYSTEM ENGINE)

// Compiles a comprehensive mutation changelog representing an absolute historical archive
export const getPageRevisionsController = asyncHandler(async (req, res) => {
  const history = await pagesService.getPageRevisionsList(req.params.id);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Historical structural state mutation list fetched successfully",
    data: history,
  });
});

// Parses and returns a single distinct historic system revision payload mapping block
export const getSingleRevisionSnapshotController = asyncHandler(async (req, res) => {
  const revision = await pagesService.getSinglePageRevision(req.params.id, req.params.revisionId);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Precise historical state snapshot extracted successfully",
    data: revision,
  });
});

// Reverses existing state metrics to precise historical snapshots via transactional operations

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


//  Exposes a structured public menu map of only active, published component modules
export const getPublicMenuTreeController = asyncHandler(async (req, res) => {
  const tree = await pagesService.getPublicMenuTree();
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Public menu tree retrieved successfully", 
    data: tree 
  });
});

//  Captures routing requests via wildcards parsing structural fullPath links with breadcrumbs
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