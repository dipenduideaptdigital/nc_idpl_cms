import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as formsService from "./contactForms.service.js";

export const createFormInstanceController = asyncHandler(async (req, res) => {
  const form = await formsService.createNewContactFormInstance(req.body);
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Contact form config instance successfully registered inside operational system loops templates structures dashboard layout metrics framework.", data: form });
});

export const getFormsCollectionController = asyncHandler(async (req, res) => {
  const list = await formsService.getContactFormsCollection();
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Contact form lists tracking configurations compiled safely pipeline runtime mapping layers fetched successfully metrics parameters checks maps.", data: list });
});

export const getSingleFormProfileController = asyncHandler(async (req, res) => {
  const profile = await formsService.getContactFormGranularProfile(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Form metadata parameters trace index profile successfully rendered context structural variables blocks tracking execution checks mapping.", data: profile });
});

export const updateFormInstanceController = asyncHandler(async (req, res) => {
  const updatedForm = await formsService.updateContactFormInstance(req.params.id, req.body);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Form structural pipeline parameters modified successfully audit snap trail log synchronized.", data: updatedForm });
});

export const removeFormInstanceController = asyncHandler(async (req, res) => {
  await formsService.executeFormDeactivationOrRemoval(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Contact form instance safely dropped from database pipelines or gracefully deactivated due to pre-existing submission relation locks data tracing parameter constraints logic loops tracking metrics checks." });
});