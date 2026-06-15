import { prisma } from "../../config/db.js";

export const BLOG_ADMIN_SELECT_INCLUDE = {
  author: { select: { id: true, name: true, email: true, avatar: true } },
  featuredImage: { select: { id: true, url: true, thumbnailUrl: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } }
};

export const BLOG_PUBLIC_SELECT_INCLUDE = {
  author: { select: { name: true, avatar: true } },
  featuredImage: { select: { url: true, thumbnailUrl: true } },
  categories: { select: { name: true, slug: true } },
  tags: { select: { name: true, slug: true } }
};

const baseFilterMask = { deletedAt: null };

export const isSlugTaken = async (slug, excludeId = null) => {
  const where = { slug, ...baseFilterMask };
  if (excludeId) where.id = { not: excludeId };
  const record = await prisma.blog.findFirst({ where, select: { id: true } });
  return !!record;
};

export const validateTaxonomyIds = async (categoryIds = [], tagIds = []) => {
  const checks = [];
  if (categoryIds.length > 0) {
    checks.push(prisma.blogCategory.count({ where: { id: { in: categoryIds } } }).then(c => c === categoryIds.length));
  } else {
    checks.push(Promise.resolve(true));
  }

  if (tagIds.length > 0) {
    checks.push(prisma.blogTag.count({ where: { id: { in: tagIds } } }).then(t => t === tagIds.length));
  } else {
    checks.push(Promise.resolve(true));
  }

  const [categoriesValid, tagsValid] = await Promise.all(checks);
  return { categoriesValid, tagsValid };
};

export const findMediaById = async (id) => {
  return await prisma.media.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
};

export const createBlogWithRevision = async (blogData, categoryIds, tagIds, actorId) => {
  return await prisma.$transaction(async (tx) => {
    if (blogData.isFeatured) {
      const activeFeaturedCount = await tx.blog.count({ where: { isFeatured: true, status: "PUBLISHED", deletedAt: null } });
      if (activeFeaturedCount >= 6) {
        throw new Error("Maximum of 6 featured blogs reached inside system pipelines configuration.");
      }
    }

    const blog = await tx.blog.create({
      data: {
        ...blogData,
        categories: { connect: categoryIds.map(id => ({ id })) },
        tags: { connect: tagIds.map(id => ({ id })) }
      },
      include: BLOG_ADMIN_SELECT_INCLUDE
    });

    await tx.blogRevision.create({
      data: { blogId: blog.id, snapshot: JSON.parse(JSON.stringify(blog)), actorId }
    });
    return blog;
  });
};

export const updateBlogWithRevision = async (id, updatePayload, categoryIds, tagIds, actorId) => {
  return await prisma.$transaction(async (tx) => {
    if (updatePayload.isFeatured) {
      const activeFeaturedCount = await tx.blog.count({ where: { isFeatured: true, status: "PUBLISHED", deletedAt: null, id: { not: id } } });
      if (activeFeaturedCount >= 6) {
        throw new Error("Maximum of 6 featured blogs reached inside system pipelines configuration.");
      }
    }

    const updateData = { ...updatePayload };
    if (categoryIds) updateData.categories = { set: categoryIds.map(id => ({ id })) };
    if (tagIds) updateData.tags = { set: tagIds.map(id => ({ id })) };

    const blog = await tx.blog.update({
      where: { id },
      data: updateData,
      include: BLOG_ADMIN_SELECT_INCLUDE
    });

    await tx.blogRevision.create({
      data: { blogId: blog.id, snapshot: JSON.parse(JSON.stringify(blog)), actorId }
    });

    return blog;
  });
};

export const trackBlogView = async (blogId, fingerprint) => {
  const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000);
  const recentView = await prisma.blogViewLog.findFirst({
    where: { blogId, fingerprint, createdAt: { gte: ONE_HOUR_AGO } },
    select: { id: true }
  });

  if (!recentView) {
    await prisma.$transaction([
      prisma.blogViewLog.create({ data: { blogId, fingerprint } }),
      prisma.blog.update({ where: { id: blogId }, data: { viewCount: { increment: 1 } } })
    ]);
  }
};

export const findBlogById = async (id) => {
  return await prisma.blog.findFirst({ where: { id, ...baseFilterMask }, include: BLOG_ADMIN_SELECT_INCLUDE });
};

export const findBlogBySlug = async (slug, isPublic = true) => {
  const where = { slug, ...baseFilterMask };
  if (isPublic) {
    where.status = "PUBLISHED";
    where.publishedAt = { lte: new Date() };
  }
  return await prisma.blog.findFirst({ where, include: isPublic ? BLOG_PUBLIC_SELECT_INCLUDE : BLOG_ADMIN_SELECT_INCLUDE });
};

export const deleteBlogAndPreviewTokens = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const record = await tx.blog.findUnique({ where: { id }, select: { slug: true } });
    if (!record) return null;

    await tx.blogPreviewToken.deleteMany({ where: { blogId: id } });

    return await tx.blog.update({
      where: { id },
      data: {
        slug: `${record.slug}__deleted__${Date.now()}`,
        deletedAt: new Date(),
        status: "ARCHIVED",
      },
    });
  });
};

export const findBlogsPaginated = async ({ skip, take, search, status, categorySlug, tagSlug, isFeatured, sortBy, sortOrder }, isPublic = true) => {
  const where = { ...baseFilterMask };
  if (isPublic) {
    where.status = "PUBLISHED";
    where.publishedAt = { lte: new Date() }; 
  } else if (status) {
    where.status = status;
  }

  if (isFeatured !== undefined) where.isFeatured = isFeatured;
  if (categorySlug) where.categories = { some: { slug: categorySlug } };
  if (tagSlug) where.tags = { some: { slug: tagSlug } };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } }
    ];
  }

  const [records, total] = await Promise.all([
    prisma.blog.findMany({
      where, skip, take, orderBy: { [sortBy]: sortOrder },
      include: isPublic ? BLOG_PUBLIC_SELECT_INCLUDE : BLOG_ADMIN_SELECT_INCLUDE
    }),
    prisma.blog.count({ where })
  ]);

  return { records, total };
};

export const getSidebarData = async () => {
  const [categories, recentPosts, popularTags] = await Promise.all([
    prisma.blogCategory.findMany({ take: 10, include: { _count: { select: { blogs: true } } }, orderBy: { blogs: { _count: "desc" } } }),
    prisma.blog.findMany({ where: { status: "PUBLISHED", deletedAt: null, publishedAt: { lte: new Date() } }, take: 5, orderBy: { publishedAt: "desc" }, select: { title: true, slug: true, publishedAt: true, featuredImage: { select: { thumbnailUrl: true } } } }),
    prisma.blogTag.findMany({ take: 15, include: { _count: { select: { blogs: true } } }, orderBy: { blogs: { _count: "desc" } } })
  ]);
  return { categories, recentPosts, popularTags };
};

export const getRelatedBlogs = async (currentBlogId, categorySlugsArray, limit = 3) => {
  return await prisma.blog.findMany({
    where: { id: { not: currentBlogId }, status: "PUBLISHED", deletedAt: null, publishedAt: { lte: new Date() }, categories: { some: { slug: { in: categorySlugsArray } } } },
    take: limit, orderBy: { publishedAt: "desc" },
    include: { featuredImage: { select: { url: true, thumbnailUrl: true } } }
  });
};

export const getAdjacentPosts = async (currentPublishedAtDate) => {
  if (!currentPublishedAtDate) return { prev: null, next: null };
  const [prev, next] = await Promise.all([
    prisma.blog.findFirst({ where: { status: "PUBLISHED", deletedAt: null, publishedAt: { lt: currentPublishedAtDate } }, orderBy: { publishedAt: "desc" }, select: { title: true, slug: true } }),
    prisma.blog.findFirst({ where: { status: "PUBLISHED", deletedAt: null, publishedAt: { gt: currentPublishedAtDate, lte: new Date() } }, orderBy: { publishedAt: "asc" }, select: { title: true, slug: true } })
  ]);
  return { prev, next };
};

export const findActivePreviewToken = async (blogId) => {
  return await prisma.blogPreviewToken.findFirst({ where: { blogId, expiresAt: { gt: new Date() }, blog: { deletedAt: null } } });
};

export const revokePreviewToken = async (blogId) => {
  return await prisma.blogPreviewToken.deleteMany({ where: { blogId } });
};

export const replaceAndCreatePreviewToken = async (data) => {
  return await prisma.$transaction(async (tx) => {
    await tx.blogPreviewToken.deleteMany({ where: { blogId: data.blogId } });
    return await tx.blogPreviewToken.create({ data });
  });
};

export const findPreviewTokenWithBlog = async (tokenHash) => {
  return await prisma.blogPreviewToken.findUnique({
    where: { tokenHash },
    include: { blog: { include: BLOG_ADMIN_SELECT_INCLUDE } }
  });
};

export const incrementPreviewTokenUsage = async (id) => {
  return await prisma.blogPreviewToken.update({ where: { id }, data: { usedCount: { increment: 1 }, lastAccessedAt: new Date() } });
};

export const publishScheduledBlogs = async () => {
  return await prisma.blog.updateMany({
    where: { status: "SCHEDULED", publishedAt: { lte: new Date() }, deletedAt: null },
    data: { status: "PUBLISHED" }
  });
};

export const deleteOldViewLogs = async (threshold) => {
  return await prisma.blogViewLog.deleteMany({ where: { createdAt: { lt: threshold } } });
};

export const deleteExpiredPreviewTokens = async () => {
  return await prisma.blogPreviewToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
};

export const findCategoryBySlug = async (slug, excludeId = null) => {
  const where = { slug };
  if (excludeId) where.id = { not: excludeId };
  return await prisma.blogCategory.findFirst({ where, select: { id: true } });
};

export const findCategoryById = async (id) => {
  return await prisma.blogCategory.findUnique({ where: { id }, select: { id: true } });
};

export const countCategoryUsage = async (id) => {
  const category = await prisma.blogCategory.findUnique({ where: { id }, include: { _count: { select: { blogs: true } } } });
  return category?._count.blogs || 0;
};

export const createCategory = async (data) => {
  return await prisma.blogCategory.create({ data });
};

export const updateCategoryRecordNode = async (id, data) => {
  return await prisma.blogCategory.update({ where: { id }, data });
};

export const deleteCategoryById = async (id) => {
  return await prisma.blogCategory.delete({ where: { id } });
};

export const findAllCategories = async () => {
  return await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
};

export const findTagBySlug = async (slug, excludeId = null) => {
  const where = { slug };
  if (excludeId) where.id = { not: excludeId };
  return await prisma.blogTag.findFirst({ where, select: { id: true } });
};

export const findTagById = async (id) => {
  return await prisma.blogTag.findUnique({ where: { id }, select: { id: true } });
};

export const countTagUsage = async (id) => {
  const tag = await prisma.blogTag.findUnique({ where: { id }, include: { _count: { select: { blogs: true } } } });
  return tag?._count.blogs || 0;
};

export const createTag = async (data) => {
  return await prisma.blogTag.create({ data });
};

export const updateTagRecordNode = async (id, data) => {
  return await prisma.blogTag.update({ where: { id }, data });
};

export const deleteTagById = async (id) => {
  return await prisma.blogTag.delete({ where: { id } });
};

export const findAllTags = async () => {
  return await prisma.blogTag.findMany({ orderBy: { name: "asc" } });
};