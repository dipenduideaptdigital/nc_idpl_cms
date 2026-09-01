import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { generateRequestFingerprint } from "../../shared/utils/fingerprint.js";
import * as formService from "./dynamic-forms.service.js";

// ADMIN CONTROLLERS

export const createFormController = asyncHandler(async (req, res) => {
  const form = await formService.createForm(req.body, req.user.id);
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Form created successfully.", data: form });
});

export const getPublishedFormsListController = asyncHandler(async (req, res) => {
  const formsList = await formService.getPublishedFormsList();
  
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Published forms retrieved successfully for CMS.", 
    data: formsList 
  });
});

export const getAdminFormController = asyncHandler(async (req, res) => {
  const form = await formService.getAdminForm(req.params.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Form loaded.", data: form });
});

export const getAdminFormsListController = asyncHandler(async (req, res) => {
  const result = await formService.getAdminFormsList(req.query);
  sendResponse({ 
    res, 
    statusCode: StatusCodes.OK, 
    message: "Forms retrieved successfully.", 
    data: result.forms,
    meta: result.meta
  });
});

export const updateFormController = asyncHandler(async (req, res) => {
  const form = await formService.updateForm(req.params.id, req.body, req.user.id);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Form updated successfully.", data: form });
});

// PUBLIC CONTROLLERS

export const getPublicFormController = asyncHandler(async (req, res) => {
  const form = await formService.getPublicForm(req.params.slug);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Form loaded.", data: form });
});

export const submitPublicFormController = asyncHandler(async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  const fingerprint = generateRequestFingerprint(req);
  const userAgent = req.headers["user-agent"] || "unknown-agent";

  const result = await formService.submitPublicForm(
    req.params.slug,
    req.body.payload,
    clientIp,
    fingerprint,
    userAgent
  );

  sendResponse({ 
    res, 
    statusCode: StatusCodes.CREATED, 
    message: "Submission processed successfully.", 
    data: result 
  });
});

// SUBMISSION MANAGEMENT CONTROLLERS
export const getFormSubmissionsController = asyncHandler(async (req, res) => {
  const submissions = await formService.getFormSubmissions(req.params.id, req.query);
  sendResponse({ res, statusCode: StatusCodes.OK, data: submissions });
});

export const getSubmissionDetailsController = asyncHandler(async (req, res) => {
  const details = await formService.getSubmissionDetails(req.params.subId);
  sendResponse({ res, statusCode: StatusCodes.OK, data: details });
});

export const updateSubmissionStatusController = asyncHandler(async (req, res) => {
  await formService.updateSubmissionStatus(req.params.subId, req.body.status);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Status updated" });
});

export const addSubmissionNoteController = asyncHandler(async (req, res) => {
  const note = await formService.addSubmissionNote(req.params.subId, req.user.id, req.body.text);
  sendResponse({ res, statusCode: StatusCodes.CREATED, message: "Note added", data: note });
});

export const deleteSubmissionController = asyncHandler(async (req, res) => {
  await formService.deleteSubmission(req.params.subId);
  sendResponse({ res, statusCode: StatusCodes.OK, message: "Submission deleted" });
});