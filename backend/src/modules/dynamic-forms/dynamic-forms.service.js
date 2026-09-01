import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import { prisma } from "../../config/db.js";
import { FieldRegistry } from "./fields/registry.js";
import { z } from "zod";
import isEqual from "lodash/isEqual.js"; 

// ADMIN SERVICES

export const createForm = async (payload, actorId) => {
  const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.title);
  
  const existing = await prisma.dynamicForm.findUnique({ where: { slug } });
  if (existing) throw new AppError("A form with this slug already exists.", StatusCodes.CONFLICT);

  return await prisma.dynamicForm.create({
    data: {
      ...payload,
      slug,
      authorId: actorId,
      updatedById: actorId
    }
  });
};

export const getPublishedFormsList = async () => {
  return await prisma.dynamicForm.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      slug: true
    },
    orderBy: {
      title: "asc"
    }
  });
};

export const getAdminForm = async (id) => {
  const form = await prisma.dynamicForm.findUnique({ where: { id } });
  if (!form) throw new AppError("Form not found.", StatusCodes.NOT_FOUND);
  return form;
};

export const getAdminFormsList = async (query) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const where = { deletedAt: null };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [forms, total] = await Promise.all([
    prisma.dynamicForm.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        version: true,
        updatedAt: true,
        _count: { select: { submissions: true } }
      }
    }),
    prisma.dynamicForm.count({ where })
  ]);

  return {
    forms,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) }
  };
};

export const updateForm = async (id, payload, actorId) => {
  const existingForm = await prisma.dynamicForm.findUnique({ where: { id } });
  if (!existingForm) throw new AppError("Form not found.", StatusCodes.NOT_FOUND);

  let newVersion = existingForm.version;
  
  // Only increment version if the actual schema structure changes
  if (!isEqual(existingForm.schema, payload.schema)) {
    newVersion += 1;
    payload.schema.version = newVersion;
  }

  let slug = existingForm.slug;
  if (payload.slug && payload.slug !== existingForm.slug) {
    slug = generateSlug(payload.slug);
    const slugCheck = await prisma.dynamicForm.findUnique({ where: { slug } });
    if (slugCheck) throw new AppError("Slug is already in use.", StatusCodes.CONFLICT);
  }

  return await prisma.dynamicForm.update({
    where: { id },
    data: {
      ...payload,
      slug,
      version: newVersion,
      updatedById: actorId
    }
  });
};

// PUBLIC SERVICES

export const getPublicForm = async (slug) => {
  const form = await prisma.dynamicForm.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null }
  });

  if (!form) throw new AppError("Form is unavailable or does not exist.", StatusCodes.NOT_FOUND);

  // Sanitize settings to prevent leaking internal configs (e.g., admin emails)
  const safeSettings = {
    submitButton: form.settings?.submitButton,
    successAction: form.settings?.successAction
  };

  return {
    id: form.id,
    title: form.title,
    description: form.description,
    schema: form.schema,
    settings: safeSettings,
    version: form.version
  };
};

export const submitPublicForm = async (slug, payload, ipAddress, fingerprint, userAgent) => {
  const form = await prisma.dynamicForm.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null }
  });

  if (!form) throw new AppError("Form is unavailable.", StatusCodes.NOT_FOUND);

  // Build a Zod Schema dynamically from the field registry
  const zodShape = {};
  
  form.schema.fields.forEach(field => {
    const fieldValidator = FieldRegistry.getZodBuilder(field.type)(field);
    zodShape[field.key] = fieldValidator;
  });

  // .strict() ensures any unknown keys injected by attackers are instantly rejected
  const dynamicValidationSchema = z.object(zodShape).strict();

  let validatedData;
  try {
    validatedData = await dynamicValidationSchema.parseAsync(payload);
  } catch (error) {
    throw new AppError(JSON.stringify(error.errors), StatusCodes.BAD_REQUEST);
  }

  const submission = await prisma.formSubmission.create({
    data: {
      formId: form.id,
      formVersion: form.version,
      payload: validatedData,
      ipAddress,
      fingerprint,
      userAgent
    }
  });

  return {
    submissionId: submission.id,
    successAction: form.settings?.successAction
  };
};

// SUBMISSION MANAGEMENT SERVICES 
export const getFormSubmissions = async (formId, query) => {
  const { status, limit = 15 } = query;
  
  const where = { formId, deletedAt: null };
  if (status) where.status = status;

  return await prisma.formSubmission.findMany({
    where,
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, payload: true, status: true, isViewed: true, createdAt: true
    }
  });
};

export const getSubmissionDetails = async (subId) => {
  const submission = await prisma.formSubmission.findUnique({
    where: { id: subId },
    include: {
      form: { select: { schema: true, title: true } },
      notes: { orderBy: { createdAt: 'desc' }, include: { author: { select: { name: true } } } }
    }
  });

  if (!submission) throw new AppError("Submission not found", StatusCodes.NOT_FOUND);

  if (!submission.isViewed) {
    await prisma.formSubmission.update({ where: { id: subId }, data: { isViewed: true } });
    submission.isViewed = true;
  }
  return submission;
};

export const updateSubmissionStatus = async (subId, status) => {
  return await prisma.formSubmission.update({ where: { id: subId }, data: { status } });
};

export const addSubmissionNote = async (subId, authorId, text) => {
  return await prisma.formSubmissionNote.create({ data: { submissionId: subId, authorId, text } });
};

export const deleteSubmission = async (subId) => {
  return await prisma.formSubmission.update({ where: { id: subId }, data: { deletedAt: new Date() } });
};