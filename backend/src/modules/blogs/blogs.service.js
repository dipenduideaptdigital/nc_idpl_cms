import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js";
import crypto from "crypto";
import { prisma } from "../../config/db.js";
import * as repo from "./blogs.repository.js";

const deepFlattenExtractPlaintextTextTokens = (inputObjectPayload) => {
  if (!inputObjectPayload) return "";
  let extractedTextBuffer = "";

  const deepRecursiveSearchTaskLoop = (nodeItem) => {
    if (typeof nodeItem === "string") {
      extractedTextBuffer += " " + nodeItem;
      return;
    }
    if (nodeItem && typeof nodeItem === "object") {
      Object.values(nodeItem).forEach(childValue => deepRecursiveSearchTaskLoop(childValue));
    }
  };

  deepRecursiveSearchTaskLoop(inputObjectPayload);
  return extractedTextBuffer.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const calculateReadingTime = (contentJsonPayload) => {
  const completelyStrippedPlaintextStr = deepFlattenExtractPlaintextTextTokens(contentJsonPayload?.blocks);
  const preciseWordsCountTotal = completelyStrippedPlaintextStr.split(/\s+/).filter(Boolean).length;
  
  if (preciseWordsCountTotal === 0) return 1;
  return Math.ceil(preciseWordsCountTotal / 200);
};

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await repo.isSlugTaken(uniqueSlug, excludeId)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

const validateScheduleDate = (status, publishedAt) => {
  if (status === "SCHEDULED") {
    if (!publishedAt) throw new AppError("A publish date is required when status is SCHEDULED.", StatusCodes.BAD_REQUEST);
    const dateObj = new Date(publishedAt);
    if (isNaN(dateObj.getTime())) throw new AppError("Invalid date format. Please use a valid ISO datetime.", StatusCodes.BAD_REQUEST);
    if (dateObj <= new Date()) throw new AppError("Scheduled date must be in the future.", StatusCodes.BAD_REQUEST);
  }
};

const enforceContentOwnershipBoundary = (resourceRecord, executingActorId, executingActorRoleSlug, userPermissions = []) => {
  const normalizedRole = executingActorRoleSlug?.toUpperCase();
  if (normalizedRole === "SUPER_ADMIN") return;
  
  if (userPermissions.includes('blog.edit')) return;

  if (resourceRecord.authorId !== executingActorId) {
    throw new AppError("Access Denied: You do not possess structural identity rights ownership to modify or read this targeted private content record profile.", StatusCodes.FORBIDDEN);
  }
};

const validateFeaturedImageAssetMimeType = async (mediaId) => {
  if (!mediaId) return;
  const mediaNodeRecord = await repo.findMediaById(mediaId);
  if (!mediaNodeRecord) throw new AppError("The requested featured image asset identifier mapping points to a non-existent or dropped database profile metadata snapshot.", StatusCodes.BAD_REQUEST);

  if (!mediaNodeRecord.mimeType.startsWith("image/")) {
    throw new AppError("Security validation error: Asset mapping validation criteria breached. Selected targeted operational index represents a non-image file type structural mapping format stream context parameters checking failure.", StatusCodes.BAD_REQUEST);
  }
};

export const createBlog = async (payload, authorId) => {
  validateScheduleDate(payload.status, payload.publishedAt);

  const { categoriesValid, tagsValid } = await repo.validateTaxonomyIds(payload.categoryIds, payload.tagIds);
  if (!categoriesValid || !tagsValid) throw new AppError("One or more selected category or tag IDs are unregistered.", StatusCodes.BAD_REQUEST);

  await validateFeaturedImageAssetMimeType(payload.featuredImageId);

  const baseSlug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.title);
  const uniqueSlug = await ensureUniqueSlug(baseSlug);

  const readingTime = calculateReadingTime(payload.content);
  const publishedAt = payload.status === "PUBLISHED" ? new Date() : (payload.status === "SCHEDULED" ? new Date(payload.publishedAt) : null);

  const { categoryIds, tagIds, ...scalarFields } = payload;
  const blogData = { ...scalarFields, slug: uniqueSlug, readingTime, publishedAt, authorId, viewCount: 0 };

  try {
    return await repo.createBlogWithRevision(blogData, categoryIds || [], tagIds || [], authorId);
  } catch (error) {
    throw new AppError(error.message, StatusCodes.CONFLICT);
  }
};

export const updateBlog = async (id, payload, actorId, actorRoleSlug, userPermissions = []) => {
  const existing = await repo.findBlogById(id);
  if (!existing) throw new AppError("Blog record reference unavailable in backend systems.", StatusCodes.NOT_FOUND);
  enforceContentOwnershipBoundary(existing, actorId, actorRoleSlug, userPermissions);

  validateScheduleDate(payload.status, payload.publishedAt);

  if (payload.categoryIds || payload.tagIds) {
    const { categoriesValid, tagsValid } = await repo.validateTaxonomyIds(payload.categoryIds, payload.tagIds);
    if (!categoriesValid || !tagsValid) throw new AppError("Taxonomy validation mismatch configuration error.", StatusCodes.BAD_REQUEST);
  }

  if (payload.featuredImageId !== undefined) {
    await validateFeaturedImageAssetMimeType(payload.featuredImageId);
  }
  
  const updateData = {};
  const allowed = ["title", "excerpt", "content", "status", "isFeatured", "metaTitle", "metaDescription", "metaKeywords", "featuredImageId", "publishedAt", "includeInSitemap", "noIndex", "noFollow", "canonicalUrl", "ogTitle", "ogDescription", "ogImageId"];
  allowed.forEach(f => { if (payload[f] !== undefined) updateData[f] = payload[f]; });

  const slugExplicitlyChanged = payload.slug !== undefined && payload.slug !== existing.slug;
  const titleChanged = payload.title !== undefined && payload.title !== existing.title && !existing.publishedAt;

  if (slugExplicitlyChanged || titleChanged) {
    const slugSource = payload.slug !== undefined ? payload.slug : payload.title;
    const baseSlug = generateSlug(slugSource);
    
    if (baseSlug !== existing.slug) {
      updateData.slug = await ensureUniqueSlug(baseSlug, id);
      
      if (existing.publishedAt) {
        await repo.createBlogSlugHistory(id, existing.slug).catch(() => {}); 
      }
    }
  }

  if (payload.content) updateData.readingTime = calculateReadingTime(payload.content);

  if (payload.status === "PUBLISHED" && existing.status === "SCHEDULED") {
    updateData.publishedAt = existing.publishedAt;
  } else if (payload.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  } else if (payload.status === "SCHEDULED" && payload.publishedAt) {
    updateData.publishedAt = new Date(payload.publishedAt);
  } else if (existing.status === "PUBLISHED") {
    updateData.publishedAt = existing.publishedAt;
  }

  try {
    return await repo.updateBlogWithRevision(id, updateData, payload.categoryIds, payload.tagIds, actorId);
  } catch (error) {
    throw new AppError(error.message, StatusCodes.CONFLICT);
  }
};

export const getPublicBlogs = async (query) => {
  const { page, limit, ...filters } = query;
  const skip = (page - 1) * limit;
  const { records, total } = await repo.findBlogsPaginated({ skip, take: limit, ...filters }, true);
  return { data: records, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getAdminBlogs = async (query, actorId, actorRoleSlug, userPermissions = []) => {
  const { page, limit, ...filters } = query;
  const skip = (page - 1) * limit;

  const normalizedRole = actorRoleSlug?.toUpperCase();
  if (normalizedRole !== "SUPER_ADMIN") {
    if (!userPermissions.includes('blog.edit')) {
      filters.authorId = actorId;
    }
  }

  const { records, total } = await repo.findBlogsPaginated({ skip, take: limit, ...filters }, false);
  return { data: records, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getAdminBlogByIdSecure = async (id, actorId, actorRoleSlug, userPermissions = []) => {
  const blog = await repo.findBlogById(id);
  if (!blog) throw new AppError("Blog post not found", StatusCodes.NOT_FOUND);
  enforceContentOwnershipBoundary(blog, actorId, actorRoleSlug, userPermissions);
  
  return blog;
};

export const getBlogBySlug = async (slug, fingerprint) => {
  const blog = await repo.findBlogBySlug(slug, true);
  if (!blog) throw new AppError("Blog not found or not yet published.", StatusCodes.NOT_FOUND);

  repo.trackBlogView(blog.id, fingerprint).catch(err => console.error("Telemetry view count mutation failed:", err));

  const categorySlugs = blog.categories.map(c => c.slug);
  const [relatedPosts, navigationSiblings, sidebar] = await Promise.all([
    repo.getRelatedBlogs(blog.id, categorySlugs, 3),
    repo.getAdjacentPosts(blog.publishedAt),
    repo.getSidebarData() 
  ]);

  return { blog, relatedPosts, navigationSiblings, sidebar };
};

export const deleteBlog = async (id, actorId, actorRoleSlug, userPermissions = []) => {
  const post = await repo.findBlogById(id);
  if (!post) throw new AppError("Target blog post record reference identity failed to resolve.", StatusCodes.NOT_FOUND);
  enforceContentOwnershipBoundary(post, actorId, actorRoleSlug, userPermissions);
  return await repo.deleteBlogAndPreviewTokens(id);
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const getBlogPreviewStatus = async (blogId) => {
  const stats = await repo.getBlogPreviewTokenStats(blogId);
  
  if (!stats) {
    return { isActive: false };
  }

  const isExpired = new Date() > stats.expiresAt;
  if (isExpired) {
    return { isActive: false, isExpired: true };
  }

  return {
    isActive: true,
    expiresAt: stats.expiresAt,
    usedCount: stats.usedCount,
    lastAccessedAt: stats.lastAccessedAt,
    createdAt: stats.createdAt
  };
};

export const generatePreviewLink = async (blogId, userId, userRoleSlug, userPermissions = [], baseUrl) => {
  const blog = await repo.findBlogById(blogId);
  if (!blog) throw new AppError("Blog not found.", StatusCodes.NOT_FOUND);
  
  enforceContentOwnershipBoundary(blog, userId, userRoleSlug, userPermissions);
  
  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await repo.replaceAndCreatePreviewToken({
    tokenHash: hashToken(rawToken),
    blogId,
    createdById: userId,
    expiresAt
  });
  return { previewUrl: `${baseUrl}/preview/${rawToken}?type=blog` };
};

export const revokePreviewLink = async (blogId, actorId, actorRoleSlug, userPermissions = []) => {
  const blog = await repo.findBlogById(blogId);
  if (!blog) throw new AppError("Target blog reference pointer invalid.", StatusCodes.NOT_FOUND);
  enforceContentOwnershipBoundary(blog, actorId, actorRoleSlug, userPermissions);
  
  return await repo.revokePreviewToken(blogId);
};

export const resolvePreviewToken = async (rawToken) => {
  const hashedTokenStr = hashToken(rawToken); 
  const tokenRecord = await repo.findPreviewTokenWithBlog(hashedTokenStr);
  
  if (!tokenRecord) throw new AppError("Preview token is invalid or corrupted.", StatusCodes.NOT_FOUND);
  if (new Date() > tokenRecord.expiresAt) throw new AppError("Preview link has expired. Please generate a new one.", StatusCodes.GONE);
  if (tokenRecord.blog.deletedAt) throw new AppError("This blog has been deleted.", StatusCodes.NOT_FOUND);

  repo.incrementPreviewTokenUsage(tokenRecord.id).catch(() => {});
  return {
    preview: { enabled: true, expiresAt: tokenRecord.expiresAt },
    blog: tokenRecord.blog
  };
};

export const createCategory = async (payload) => {
  const slug = generateSlug(payload.name);
  const exists = await prisma.blogCategory.findUnique({ where: { slug } });
  if (exists) throw new AppError("A category with this name already exists.", StatusCodes.CONFLICT);
  return await repo.createCategory({ name: payload.name, slug });
};

export const updateCategory = async (id, payload) => {
  const slug = generateSlug(payload.name);
  const exists = await repo.findCategoryBySlug(slug, id);
  if (exists) throw new AppError("A category with this name already exists.", StatusCodes.CONFLICT);
  return await repo.updateCategoryRecordNode(id, { name: payload.name, slug });
};

export const deleteCategory = async (id) => {
  const category = await repo.findCategoryById(id);
  if (!category) throw new AppError("Category not found.", StatusCodes.NOT_FOUND);
  
  const usageCount = await repo.countCategoryUsage(id);
  if (usageCount > 0) throw new AppError("Cannot remove: Category is actively bound to live blog posts.", StatusCodes.CONFLICT);
  
  return await repo.deleteCategoryById(id);
};

export const getAllCategories = async () => {
  return await repo.findAllCategories();
};

export const createTag = async (payload) => {
  const slug = generateSlug(payload.name);
  const exists = await prisma.blogTag.findUnique({ where: { slug } });
  if (exists) throw new AppError("A tag with this name already exists.", StatusCodes.CONFLICT);
  return await repo.createTag({ name: payload.name, slug });
};

export const updateTag = async (id, payload) => {
  const slug = generateSlug(payload.name);
  const exists = await repo.findTagBySlug(slug, id);
  if (exists) throw new AppError("A tag with this name already exists.", StatusCodes.CONFLICT);
  return await repo.updateTagRecordNode(id, { name: payload.name, slug });
};

export const deleteTag = async (id) => {
  const tag = await repo.findTagById(id);
  if (!tag) throw new AppError("Tag not found.", StatusCodes.NOT_FOUND);

  const usageCount = await repo.countTagUsage(id);
  if (usageCount > 0) throw new AppError("Cannot delete: This tag is assigned to one or more blogs.", StatusCodes.CONFLICT);

  return await repo.deleteTagById(id);
};

export const getAllTags = async () => {
  return await repo.findAllTags();
};