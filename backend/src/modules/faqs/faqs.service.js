import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import * as repo from "./faqs.repository.js";

// Slug Helper

const makeSlug = (value) => {
  const slug = generateSlug(value)
    .replace(/\//g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120)
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new AppError(
      "A valid category slug is required.",
      StatusCodes.BAD_REQUEST
    );
  }

  return slug;
};

// Prisma Error Handling

const write = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError(
        "A category with this slug already exists.",
        StatusCodes.CONFLICT
      );
    }

    if (error.code === "P2025") {
      throw new AppError(
        "FAQ record not found.",
        StatusCodes.NOT_FOUND
      );
    }

    if (error.code === "P2003") {
      throw new AppError(
        "Associated category not found or invalid relation.",
        StatusCodes.BAD_REQUEST
      );
    }

    throw error;
  }
};

// Category Services

export const createFaqCategory = async (payload) => {
  const slug = makeSlug(payload.slug || payload.name);

  if (await repo.findCategoryBySlug(slug)) {
    throw new AppError(
      "A category with this slug already exists.",
      StatusCodes.CONFLICT
    );
  }

  return write(() =>
    repo.createCategory({ ...payload, slug })
  );
};

export const getAllFaqCategories = (isAdmin = false) =>
  repo.findAllCategories(isAdmin);

export const updateFaqCategory = async (id, payload) => {
  const category = await repo.findCategoryById(id);

  if (!category) {
    throw new AppError(
      "Category not found.",
      StatusCodes.NOT_FOUND
    );
  }

  const data = { ...payload };

  if (
    payload.slug !== undefined ||
    (payload.name && payload.name !== category.name)
  ) {
    data.slug = makeSlug(payload.slug || payload.name);

    const existing = await repo.findCategoryBySlug(data.slug);

    if (existing && existing.id !== id) {
      throw new AppError(
        "A category with this slug already exists.",
        StatusCodes.CONFLICT
      );
    }
  }

  return write(() => repo.updateCategory(id, data));
};

export const deleteFaqCategory = (id) =>
  write(() => repo.deleteCategory(id));

// Question Services

export const createFaqQuestion = async (payload) => {
  if (!(await repo.findCategoryById(payload.categoryId))) {
    throw new AppError(
      "Associated category not found.",
      StatusCodes.BAD_REQUEST
    );
  }

  return write(() => repo.createQuestion(payload));
};

export const getFilteredQuestions = (query) =>
  repo.findAllQuestions(query);

export const updateFaqQuestion = async (id, payload) => {
  if (!(await repo.findQuestionById(id))) {
    throw new AppError(
      "FAQ question not found.",
      StatusCodes.NOT_FOUND
    );
  }

  if (
    payload.categoryId &&
    !(await repo.findCategoryById(payload.categoryId))
  ) {
    throw new AppError(
      "Associated category not found.",
      StatusCodes.BAD_REQUEST
    );
  }

  return write(() => repo.updateQuestion(id, payload));
};

export const deleteFaqQuestion = (id) =>
  write(() => repo.deleteQuestion(id));

// Reorder Service

export const reorderItems = async (type, items) => {
  if (!["category", "question"].includes(type)) {
    throw new AppError(
      "Invalid reorder type.",
      StatusCodes.BAD_REQUEST
    );
  }

  const model =
    type === "category" ? "faqCategory" : "faqQuestion";

  return write(() =>
    repo.bulkUpdateSortOrder(model, items)
  );
};

// Public FAQ Service

export const getPublicGroupedFaqs = () =>
  repo.findPublicGroupedFaqs();