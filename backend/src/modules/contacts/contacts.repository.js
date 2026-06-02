import { prisma } from "../../config/db.js";
import crypto from "crypto";

const activeCondition = { deletedAt: null };


export const checkRateLimitThreshold = async (fingerprint, timeWindowMs = 10 * 60 * 1000) => {
  const boundary = new Date(Date.now() - timeWindowMs);
  return await prisma.contactSubmission.count({
    where: { fingerprint, createdAt: { gte: boundary } }
  });
};


export const checkExactDuplicateSubmissionByHash = async (email, rawMessageContent, formId, timeWindowMs = 60 * 60 * 1000) => {
  const boundary = new Date(Date.now() - timeWindowMs);
  const messageHash = crypto.createHash("sha256").update(rawMessageContent).digest("hex");

  const duplicateRecord = await prisma.contactSubmission.findFirst({
    where: {
      email,
      messageHash,
      formId, 
      createdAt: { gte: boundary },
      deletedAt: null
    },
    select: { id: true }
  });
  return !!duplicateRecord;
};

// Ingests contact entries transactional loops recording tracking history snapshots
export const persistSubmissionRecord = async (cleanPayload, rawMessageText) => {
  const computedTextHashStr = crypto.createHash("sha256").update(rawMessageText).digest("hex");
  
  return await prisma.$transaction(async (tx) => {
    const submission = await tx.contactSubmission.create({
      data: {
        ...cleanPayload,
        messageHash: computedTextHashStr
      }
    });
    
    await tx.contactSubmissionLog.create({
      data: {
        submissionId: submission.id,
        fromStatus: "NEW",
        toStatus: "NEW",
        note: "Submission created"
      }
    });
    return submission;
  });
};


export const validateAndMutateStateWorkflow = async (id, targetStatus, auditNote, actorId) => {
  const RIGID_STATE_TRANSITIONS = {
    "NEW": ["IN_PROGRESS", "SPAM", "ARCHIVED"],
    "IN_PROGRESS": ["RESOLVED", "SPAM", "ARCHIVED"],
    "RESOLVED": ["ARCHIVED"], 
    "SPAM": ["ARCHIVED"],     
    "ARCHIVED": []            
  };

  return await prisma.$transaction(async (tx) => {
    const record = await tx.contactSubmission.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!record) return null;

    const allowedPaths = RIGID_STATE_TRANSITIONS[record.status] || [];
    if (!allowedPaths.includes(targetStatus) && record.status !== targetStatus) {
      throw new Error(`Lifecycle constraint violation: The transition map routine logic processing flow definition from state rules path bounds execution parameters mapping layer validation logic rules failed across '${record.status}' to '${targetStatus}' sequence blocks.`);
    }

    const dataUpdatesMap = { status: targetStatus };
    if (targetStatus === "RESOLVED") {
      dataUpdatesMap.resolvedAt = new Date(); // Analytics capture loop metrics activation point
    }

    const updated = await tx.contactSubmission.update({
      where: { id },
      data: dataUpdatesMap
    });

    await tx.contactSubmissionLog.create({
      data: {
        submissionId: id,
        fromStatus: record.status,
        toStatus: targetStatus,
        actorId,
        note: auditNote || `Status workflow adjusted manually down into ${targetStatus}`
      }
    });
    return updated;
  });
};


export const processExplicitLeadRestorationTransaction = async (id, actorId, administrativeReasonNote) => {
  return await prisma.$transaction(async (tx) => {
    const currentLeadSnapshot = await tx.contactSubmission.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!currentLeadSnapshot) return null;

    if (currentLeadSnapshot.status !== "SPAM" && currentLeadSnapshot.status !== "ARCHIVED") {
      throw new Error("Active lead submission records are already running in an open contextual workflow operation state. Restoration command signals rejected.");
    }

    const restoredNodeRecord = await tx.contactSubmission.update({
      where: { id },
      data: { status: "IN_PROGRESS" } 
    });

    await tx.contactSubmissionLog.create({
      data: {
        submissionId: id,
        fromStatus: currentLeadSnapshot.status,
        toStatus: "IN_PROGRESS",
        actorId,
        note: administrativeReasonNote || "Deliberate explicit administrative lead lifecycle restoration override command execution transaction processed successfully."
      }
    });

    return restoredNodeRecord;
  });
};

export const createInternalCollaborationNoteRecord = async (submissionId, authorId, scrubbedNoteText) => {
  return await prisma.contactInternalNote.create({
    data: { submissionId, authorId, note: scrubbedNoteText },
    include: { author: { select: { name: true, email: true } } }
  });
};

export const findSubmissionDetailsById = async (id) => {
  return await prisma.contactSubmission.findFirst({
    where: { id, ...activeCondition },
    include: {
      form: { select: { id: true, name: true, slug: true, successMessage: true, redirectUrl: true } },
      auditLogs: { orderBy: { createdAt: "desc" }, include: { actor: { select: { name: true } } } },
      internalNotes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, avatar: true } } } }
    }
  });
};

export const updateViewedReadStatusState = async (id, isViewedValue = true) => {
  return await prisma.contactSubmission.update({
    where: { id },
    data: { isViewed: isViewedValue }
  });
};

export const findSubmissionsPaginatedMatrix = async ({ skip, take, search, status, formId, startDate, endDate, sortBy, sortOrder }) => {
  const where = { ...activeCondition };

  if (status) where.status = status;
  if (formId) where.formId = formId;
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } }, 
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } }
    ];
  }

  const [records, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: { form: { select: { id: true, name: true, slug: true } } }
    }),
    prisma.contactSubmission.count({ where })
  ]);

  return { records, total };
};


export const computeAdvancedDashboardTelemetryAggregations = async (formId = undefined) => {
  const baseCondition = { deletedAt: null };
  if (formId) baseCondition.formId = formId;

  const todayStartBoundary = new Date();
  todayStartBoundary.setHours(0,0,0,0);
  
  const currentMonthStartBoundary = new Date();
  currentMonthStartBoundary.setDate(1);
  currentMonthStartBoundary.setHours(0,0,0,0);

  const [
    unreadCount,
    totalNew,
    totalInProgress,
    totalResolved,
    totalSpam,
    todayCount,
    thisMonthCount
  ] = await Promise.all([
    prisma.contactSubmission.count({ where: { isViewed: false, ...baseCondition } }),
    prisma.contactSubmission.count({ where: { status: "NEW", ...baseCondition } }),
    prisma.contactSubmission.count({ where: { status: "IN_PROGRESS", ...baseCondition } }),
    prisma.contactSubmission.count({ where: { status: "RESOLVED", ...baseCondition } }),
    prisma.contactSubmission.count({ where: { status: "SPAM", ...baseCondition } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: todayStartBoundary }, ...baseCondition } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: currentMonthStartBoundary }, ...baseCondition } })
  ]);

  return {
    unreadCount,
    totalNew,
    totalInProgress,
    totalResolved,
    totalSpam,
    todayCount,
    thisMonthCount
  };
};

export const anonymizeCompliantSubmissionData = async (id, actorId) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.contactSubmission.findUnique({ where: { id } });
    if (!record) return;

    await tx.contactSubmission.update({
      where: { id },
      data: {
        name: "Anonymized Lead Reference Record Context",
        email: `compliance-drop-trace-${id}@gdpr-operation.internal`,
        phone: null,
        subject: record.subject ? "Obfuscated Compliance Header Reference System" : null,
        message: null, // CRITICAL DATA ERASE PROTECTION: Completely purging physical text column records
        ipAddress: "0.0.0.0",
        userAgent: "masked-compliance-agent",
        fingerprint: null,
        deletedAt: new Date(),
        status: "ARCHIVED"
      }
    });

    await tx.contactSubmissionLog.create({
      data: {
        submissionId: id,
        fromStatus: record.status,
        toStatus: "ARCHIVED",
        actorId,
        note: "GDPR Right-to-be-Forgotten erasure framework transaction completed safely. Column identifiers and text content completely zeroed down parameters."
      }
    });
  });
};