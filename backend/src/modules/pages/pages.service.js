import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import { serializePage } from "../../shared/utils/serializePage.js";
import isEqual from "lodash/isEqual.js";
import * as repo from "./pages.repository.js";
import { prisma } from "../../config/db.js";

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await repo.checkSlugExists(uniqueSlug, excludeId)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

const validateFeaturedImage = async (mediaId) => {
  if (!mediaId) return;
  const media = await prisma.media.findFirst({
    where: { id: mediaId, deletedAt: null }
  });
  if (!media) throw new AppError("Featured image not found or deleted", StatusCodes.BAD_REQUEST);
};

const buildFullSnapshot = (page) => ({
  title: page.title,
  slug: page.slug,
  excerpt: page.excerpt,
  content: page.content,
  status: page.status,
  template: page.template,
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  metaKeywords: page.metaKeywords,
  featuredImageId: page.featuredImageId,
});

export const createNewPage = async (payload, authorId) => {
  await validateFeaturedImage(payload.featuredImageId);

  const baseSlug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.title);
  const finalSlug = await ensureUniqueSlug(baseSlug);

  const publishedAt = payload.status === "PUBLISHED" ? new Date() : null;

  const pageData = {
    ...payload,
    slug: finalSlug,
    authorId,
    updatedById: authorId,
    publishedAt,
  };

  try {
    const page = await repo.createPageWithRevision(pageData, authorId);
    return serializePage(page, "admin");
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      throw new AppError("Slug was just taken by another process. Please try again.", StatusCodes.CONFLICT);
    }
    throw error;
  }
};

export const updateExistingPage = async (id, payload, actorId) => {
  const existingPage = await repo.findPageById(id);
  if (!existingPage) throw new AppError("Page not found", StatusCodes.NOT_FOUND);

  if (payload.featuredImageId !== undefined) {
    await validateFeaturedImage(payload.featuredImageId);
  }

  const updateData = { updatedById: actorId };
  
  // Explicitly build update payload to avoid undefined overrides
  const allowedFields = ["title", "excerpt", "content", "status", "template", "metaTitle", "metaDescription", "metaKeywords", "featuredImageId"];
  allowedFields.forEach(field => {
    if (payload[field] !== undefined) updateData[field] = payload[field];
  });

  if (payload.slug !== undefined || (payload.title !== undefined && payload.title !== existingPage.title && !existingPage.publishedAt)) {
    const slugSource = payload.slug !== undefined ? payload.slug : payload.title;
    updateData.slug = await ensureUniqueSlug(generateSlug(slugSource), id);
  }

  if (payload.status === "PUBLISHED" && existingPage.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  } else if (payload.status === "DRAFT" || payload.status === "ARCHIVED") {
    // Keeping publishedAt for SEO history intentionally
  }

  const stateToCompare = { ...existingPage, ...updateData };
  const existingSnapshot = buildFullSnapshot(existingPage);
  const proposedSnapshot = buildFullSnapshot(stateToCompare);
  
  const newSnapshot = !isEqual(existingSnapshot, proposedSnapshot) ? proposedSnapshot : null;

  const updatedPage = await repo.updatePageWithRevision(id, updateData, newSnapshot, actorId);
  return serializePage(updatedPage, "admin");
};

export const duplicatePage = async (originalId, actorId) => {
  const original = await repo.findPageById(originalId);
  if (!original) throw new AppError("Original page not found", StatusCodes.NOT_FOUND);

  const clonedTitle = `${original.title} (Copy)`;
  const finalSlug = await ensureUniqueSlug(generateSlug(clonedTitle));

  const pageData = {
    title: clonedTitle,
    slug: finalSlug,
    excerpt: original.excerpt,
    content: structuredClone(original.content),
    status: "DRAFT",
    template: original.template,
    metaTitle: original.metaTitle,
    metaDescription: original.metaDescription,
    metaKeywords: original.metaKeywords,
    featuredImageId: original.featuredImageId,
    authorId: actorId,
    updatedById: actorId,
    publishedAt: null,
  };

  const page = await repo.createPageWithRevision(pageData, actorId);
  return serializePage(page, "admin");
};

export const deletePage = async (id, actorId) => {
  const page = await repo.findPageById(id);
  if (!page) throw new AppError("Page not found", StatusCodes.NOT_FOUND);
  return await repo.softDeletePage(page, actorId); 
};

export const getPagesList = async (query) => {
  const { page, limit, ...filters } = query;
  const skip = (page - 1) * limit;
  
  const { pages, total } = await repo.findPagesList({ skip, take: limit, ...filters });
  
  return {
    data: pages.map(p => serializePage(p, "admin")),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export const getPublicPageBySlug = async (slug) => {
  const page = await repo.findPageBySlug(slug);
  
  if (!page || page.status !== "PUBLISHED") {
    throw new AppError("Page not found", StatusCodes.NOT_FOUND);
  }
  
  return serializePage(page, "public");
};