import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";

import * as service from "./faqs.service.js";

import {
  questionQuerySchema,
  reorderQuerySchema,
} from "./faqs.validation.js";

// Query Validation Helper

const parseQuery = (schema, query) => {
  const result = schema.safeParse(query);

  if (!result.success) {
    throw new AppError(
      result.error.issues[0].message,
      StatusCodes.BAD_REQUEST
    );
  }

  return result.data;
};

// Category Controllers

export const createCategoryController = asyncHandler(
  async (req, res) => {
    const category = await service.createFaqCategory(req.body);

    sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "FAQ category created successfully",
      data: category,
    });
  }
);

export const getAdminCategoriesController = asyncHandler(
  async (req, res) => {
    const categories = await service.getAllFaqCategories(true);

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: categories,
    });
  }
);

export const updateCategoryController = asyncHandler(
  async (req, res) => {
    const category = await service.updateFaqCategory(
      req.params.id,
      req.body
    );

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Category updated successfully",
      data: category,
    });
  }
);

export const deleteCategoryController = asyncHandler(
  async (req, res) => {
    await service.deleteFaqCategory(req.params.id);

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Category deleted successfully",
    });
  }
);

// Question Controllers

export const createQuestionController = asyncHandler(
  async (req, res) => {
    const question = await service.createFaqQuestion(req.body);

    sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "FAQ question created successfully",
      data: question,
    });
  }
);

export const getAdminQuestionsController = asyncHandler(
  async (req, res) => {
    const query = parseQuery(questionQuerySchema, req.query);

    const questions = await service.getFilteredQuestions(query);

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      data: questions,
    });
  }
);

export const updateQuestionController = asyncHandler(
  async (req, res) => {
    const question = await service.updateFaqQuestion(
      req.params.id,
      req.body
    );

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "FAQ question updated successfully",
      data: question,
    });
  }
);

export const deleteQuestionController = asyncHandler(
  async (req, res) => {
    await service.deleteFaqQuestion(req.params.id);

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "FAQ question deleted successfully",
    });
  }
);

// Reorder Controller

export const reorderController = asyncHandler(
  async (req, res) => {
    const { type } = parseQuery(reorderQuerySchema, req.query);

    await service.reorderItems(type, req.body.items);

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Order updated successfully",
    });
  }
);

// Public Controller

export const getPublicFaqsController = asyncHandler(
  async (req, res) => {
    const faqs = await service.getPublicGroupedFaqs();

    sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Public FAQs retrieved successfully",
      data: faqs,
    });
  }
);