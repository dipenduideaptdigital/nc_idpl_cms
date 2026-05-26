import { prisma } from "../../config/db.js";

export const PAGES_ADMIN_INCLUDE = {
  author: { select: { id: true, name: true, email: true } },
  featuredImage: { select: { id: true, url: true, thumbnailUrl: true } },
};

export const PAGES_PUBLIC_INCLUDE = {
  author: { select: { name: true } },
  featuredImage: { select: { url: true, thumbnailUrl: true } },
};

const activeCondition = { deletedAt: null };

export const checkSlugExists = async (slug, excludeId = null) => {
  const whereClause = { slug, ...activeCondition };
  if (excludeId) whereClause.id = { not: excludeId };
  
  const page = await prisma.page.findFirst({
    where: whereClause,
    select: { id: true }
  });
  return !!page;
};

export const findPageById = async (id, includeParams = PAGES_ADMIN_INCLUDE) => {
  return await prisma.page.findFirst({
    where: { id, ...activeCondition },
    include: includeParams,
  });
};

export const findPageBySlug = async (slug, includeParams = PAGES_PUBLIC_INCLUDE) => {
  return await prisma.page.findFirst({
    where: { slug, ...activeCondition },
    include: includeParams,
  });
};

export const createPageWithRevision = async (pageData, actorId) => {
  return await prisma.$transaction(async (tx) => {
    const page = await tx.page.create({
      data: pageData,
      include: PAGES_ADMIN_INCLUDE,
    });

    const snapshot = {
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
    };

    await tx.pageRevision.create({
      data: {
        pageId: page.id,
        snapshot,
        actorId,
      }
    });

    return page;
  });
};

export const updatePageWithRevision = async (id, updateData, newSnapshot, actorId) => {
  return await prisma.$transaction(async (tx) => {
    const page = await tx.page.update({
      where: { id },
      data: updateData,
      include: PAGES_ADMIN_INCLUDE,
    });

    if (newSnapshot) {
      await tx.pageRevision.create({
        data: {
          pageId: page.id,
          snapshot: newSnapshot,
          actorId,
        }
      });
    }

    return page;
  });
};

export const softDeletePage = async (page, actorId) => {
  const mutatedSlug = `${page.slug}__deleted__${Date.now()}`;

  return await prisma.page.update({
    where: { id: page.id },
    data: {
      slug: mutatedSlug,
      deletedAt: new Date(),
      status: "ARCHIVED",
      updatedById: actorId,
    }
  });
};

export const findPagesList = async ({ skip, take, search, status, template, authorId, sortBy, sortOrder }) => {
  const where = { ...activeCondition };

  if (status) where.status = status;
  if (template) where.template = template;
  if (authorId) where.authorId = authorId;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
      { metaTitle: { contains: search } }
    ];
  }

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: PAGES_ADMIN_INCLUDE,
    }),
    prisma.page.count({ where })
  ]);

  return { pages, total };
};