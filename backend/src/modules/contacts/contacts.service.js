import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { verifyRecaptchaToken } from "../../shared/services/recaptcha.service.js";
import { queueAdminNotificationEmail } from "../../shared/services/notification.service.js";
import { prisma } from "../../config/db.js";
import * as repo from "./contacts.repository.js";
import xss from "xss";

export const executeContactSubmissionLifecycle = async (payload, clientIp, requestFingerprint) => {
  const currentWindowTrafficVolume = await repo.checkRateLimitThreshold(requestFingerprint, 10 * 60 * 1000);
  if (currentWindowTrafficVolume >= 5) {
    throw new AppError(
      "Rate limit threshold breached. Abuse monitoring active. Please retry your transmission sequence after 10 minutes.", 
      StatusCodes.TOO_MANY_REQUESTS
    );
  }

  const routingSetting = await prisma.setting.findUnique({ where: { key: "contact_routing_settings" } });
  const notifyEmails = routingSetting?.value?.content?.notifyEmails || ["sales@naturecube.in"];
  const successMessage = routingSetting?.value?.content?.successMessage || "Thank you! Your submission has been successfully processed.";
  const redirectUrl = routingSetting?.value?.content?.redirectUrl || null;

  const rawEmail = payload.email.toLowerCase().trim();
  const rawMessage = payload.message.trim();
  const normalizedPhoneString = payload.phone ? payload.phone.replace(/[^0-9+]/g, "") : null;
  const rawWebsite = payload.website ? xss(payload.website.trim()) : null;

  const isDuplicateActive = await repo.checkExactDuplicateSubmissionByHash(rawEmail, rawMessage);
  if (isDuplicateActive) {
    throw new AppError(
      "Duplicate submission blocked: An identical message pattern has already been processed within the past hour.", 
      StatusCodes.CONFLICT
    );
  }

  if (payload.recaptchaToken) {
    await verifyRecaptchaToken(payload.recaptchaToken, clientIp);
  }

  const cleanPayloadMappingRecord = {
    name: xss(payload.name.trim()),
    email: rawEmail,
    phone: normalizedPhoneString,
    website: rawWebsite,
    subject: payload.subject ? xss(payload.subject.trim()) : null,
    message: xss(rawMessage),
    sourcePage: payload.sourcePage || null, 
    ipAddress: clientIp,
    userAgent: payload.userAgent || "unknown-agent",
    fingerprint: requestFingerprint,
    status: "NEW",
    isViewed: false
  };

  const savedSubmission = await repo.persistSubmissionRecord(cleanPayloadMappingRecord, rawMessage);
  
  await queueAdminNotificationEmail(savedSubmission, notifyEmails);

  return { 
    id: savedSubmission.id, 
    status: savedSubmission.status,
    successMessage: successMessage,
    redirectUrl: redirectUrl
  };
};

export const updateSubmissionWorkflowState = async (id, status, note, actorId) => {
  try {
    const scrubbedNoteText = note ? xss(note.trim()) : null;
    return await repo.validateAndMutateStateWorkflow(id, status, scrubbedNoteText, actorId);
  } catch (error) {
    throw new AppError(error.message, StatusCodes.CONFLICT);
  }
};

export const executeExplicitLeadRestoration = async (id, actorId, internalReasonNote) => {
  try {
    const scrubbedReasonNoteStr = internalReasonNote ? xss(internalReasonNote.trim()) : null;
    const restoredRecord = await repo.processExplicitLeadRestorationTransaction(id, actorId, scrubbedReasonNoteStr);
    
    if (!restoredRecord) {
      throw new AppError("Target lead resource could not be found to complete restoration protocols.", StatusCodes.NOT_FOUND);
    }
    
    return restoredRecord;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message, StatusCodes.CONFLICT);
  }
};

export const appendInternalCollaborationNote = async (submissionId, authorId, noteText) => {
  const existingLead = await repo.findSubmissionDetailsById(submissionId);
  if (!existingLead) {
    throw new AppError("Target submission identity invalid, cross relational mapping constraint failure.", StatusCodes.NOT_FOUND);
  }

  const scrubbedInternalNoteText = xss(noteText.trim());

  return await repo.createInternalCollaborationNoteRecord(submissionId, authorId, scrubbedInternalNoteText);
};

export const getLeadSubmissionCollection = async (query) => {
  const { page, limit, ...filters } = query;
  const skip = (page - 1) * limit;

  const { records, total } = await repo.findSubmissionsPaginatedMatrix({ skip, take: limit, ...filters });

  return {
    data: records,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getLeadDetailedAuditManifest = async (id) => {
  const record = await repo.findSubmissionDetailsById(id);
  if (!record) {
    throw new AppError("Lead manifest contextual tracking log reference index mismatch.", StatusCodes.NOT_FOUND);
  }

  if (!record.isViewed) {
    await repo.updateViewedReadStatusState(id, true);
    record.isViewed = true; 
  }

  return record;
};

export const fetchDashboardTelemetryMetrics = async (formId) => {
  return await repo.computeAdvancedDashboardTelemetryAggregations(formId);
};

export const executeGDPRCompliantDataErasure = async (id, actorId) => {
  const record = await repo.findSubmissionDetailsById(id);
  if (!record) {
    throw new AppError("Target lead snapshot variable invalid or already dropped from relational storage maps grid.", StatusCodes.NOT_FOUND);
  }

  await repo.anonymizeCompliantSubmissionData(id, actorId);
  return true;
};