import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { generateRequestFingerprint } from "../../shared/utils/fingerprint.js";
import * as contactService from "./contacts.service.js";


export const submitPublicContactFormController = asyncHandler(async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  
  // Generate deterministic device context profile fingerprint signature for abuse monitoring
  const calculatedFingerprintProfile = generateRequestFingerprint(req);
  const userAgentString = req.headers["user-agent"] || "unknown-agent";

  const payloadInputData = {
    ...req.body,
    userAgent: userAgentString
  };

  // Trigger high-performance secure intake execution pipeline
  const resultStatusNode = await contactService.executeContactSubmissionLifecycle(
    payloadInputData, 
    clientIp, 
    calculatedFingerprintProfile
  );

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Lead submission pipeline successfully processed. Ingestion tracking reference parameters saved.",
    data: resultStatusNode
  });
});

// Fetch Paginated Matrix of Submissions with multi-mode search and date filters
export const getAdminSubmissionsCollectionController = asyncHandler(async (req, res) => {
  const collectionMatrixResult = await contactService.getLeadSubmissionCollection(req.query);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Administrative lead collections grid list successfully built and filtered parameter logs matrices extracted.",
    data: collectionMatrixResult.data,
    meta: collectionMatrixResult.meta
  });
});


export const getAdminSubmissionAuditDetailsController = asyncHandler(async (req, res) => {
  const granularLeadManifest = await contactService.getLeadDetailedAuditManifest(req.params.id);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Granular lead detailed status logging context audit log stream successfully compiled data tracking map objects parameters.",
    data: granularLeadManifest
  });
});


export const updateAdminSubmissionWorkflowController = asyncHandler(async (req, res) => {
  const updatedStateNode = await contactService.updateSubmissionWorkflowState(
    req.params.id,
    req.body.status,
    req.body.note,
    req.user.id
  );

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Subsystem workflow pipeline state successfully advanced. Audit record context log created safely.",
    data: updatedStateNode
  });
});

export const restoreExplicitAdminSubmissionOverrideController = asyncHandler(async (req, res) => {
  const restoredNodeVersion = await contactService.executeExplicitLeadRestoration(
    req.params.id,
    req.user.id,
    req.body.note 
  );

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Explicit override operational lifecycle restoration protocol completed successfully. Targeted entity active in dashboard metrics pipelines.",
    data: restoredNodeVersion
  });
});


export const createAdminSubmissionInternalNoteController = asyncHandler(async (req, res) => {
  const noteNodeRecord = await contactService.appendInternalCollaborationNote(
    req.params.id,
    req.user.id,
    req.body.note
  );

  sendResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "Internal collaboration workflow layout comment log appended successfully.",
    data: noteNodeRecord
  });
});


export const getAdminSubmissionsDashboardMetricsController = asyncHandler(async (req, res) => {
  const metricsSnapshot = await contactService.fetchDashboardTelemetryMetrics();

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Dynamic counters collection metrics logs successfully aggregated across persistent data engine caches.",
    data: metricsSnapshot
  });
});


export const removeAdminSubmissionErasureController = asyncHandler(async (req, res) => {
  await contactService.executeGDPRCompliantDataErasure(req.params.id, req.user.id);

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Operational identity payload contextual columns securely obfuscated to zero string content. Hard metadata drops compliance logic completed successfully trace indexes logs locked archived."
  });
});