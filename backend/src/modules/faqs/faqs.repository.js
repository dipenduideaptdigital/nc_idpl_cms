import { prisma } from "../../config/db.js";

// Categories

export const createCategory = (data) =>
  prisma.faqCategory.create({ data });

export const findAllCategories = (isAdmin = false) =>
  prisma.faqCategory.findMany({
    where: isAdmin ? {} : { status: "PUBLISHED" },

    orderBy: [
      { sortOrder: "asc" },
      { id: "asc" },
    ],

    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

export const findCategoryBySlug = (slug) =>
  prisma.faqCategory.findUnique({
    where: { slug },
  });

export const findCategoryById = (id) =>
  prisma.faqCategory.findUnique({
    where: { id },
  });

export const updateCategory = (id, data) =>
  prisma.faqCategory.update({
    where: { id },
    data,
  });

export const deleteCategory = (id) =>
  prisma.faqCategory.delete({
    where: { id },
  });

// Questions

export const createQuestion = (data) =>
  prisma.faqQuestion.create({
    data,
    include: { category: true },
  });

export const findAllQuestions = (query = {}) => {
  const { categoryId, status, search } = query;
  const where = {};

  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;

  if (search) {
    where.OR = [
      { question: { contains: search } },
    ];
  }

  return prisma.faqQuestion.findMany({
    where,

    orderBy: [
      { sortOrder: "asc" },
      { id: "asc" },
    ],

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};

export const findQuestionById = (id) =>
  prisma.faqQuestion.findUnique({
    where: { id },
    include: { category: true },
  });

export const updateQuestion = (id, data) =>
  prisma.faqQuestion.update({
    where: { id },
    data,
    include: { category: true },
  });

export const deleteQuestion = (id) =>
  prisma.faqQuestion.delete({
    where: { id },
  });

// Reorder Transaction

export const bulkUpdateSortOrder = async (model, items) => {
  const transactions = items.map(item =>
    prisma[model].update({
      where: { id: item.id },
      data: { sortOrder: item.sortOrder },
    })
  );

  return prisma.$transaction(transactions);
};

// Public Grouped FAQs

export const findPublicGroupedFaqs = () =>
  prisma.faqCategory.findMany({
    where: {
      status: "PUBLISHED",

      questions: {
        some: {
          status: "PUBLISHED",
        },
      },
    },

    orderBy: [
      { sortOrder: "asc" },
      { id: "asc" },
    ],

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,

      questions: {
        where: {
          status: "PUBLISHED",
        },

        orderBy: [
          { sortOrder: "asc" },
          { id: "asc" },
        ],

        select: {
          id: true,
          categoryId: true,
          question: true,
          answer: true,
          sortOrder: true,
        },
      },
    },
  });