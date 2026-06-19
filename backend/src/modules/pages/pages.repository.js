import { prisma } from "../../config/db.js";

export const PAGES_ADMIN_INCLUDE = {
  author: { select: { id: true, name: true, email: true } },
  featuredImage: { select: { id: true, url: true, thumbnailUrl: true, mimeType: true } },
  ogImage: { select: { id: true, url: true, thumbnailUrl: true, mimeType: true } },
};

export const PAGES_PUBLIC_INCLUDE = {
  author: { select: { name: true } },
  featuredImage: { select: { url: true, thumbnailUrl: true } },
  ogImage: { select: { url: true, thumbnailUrl: true } },
};

const activeCondition = { deletedAt: null };

export const checkFullPathExists = async (fullPath, excludeId = null) => {
  const whereClause = { fullPath, ...activeCondition };
  if (excludeId) whereClause.id = { not: excludeId };
  
  const page = await prisma.page.findFirst({
    where: whereClause,
    select: { id: true }
  });
  return !!page;
};

export const checkSiblingSlugExists = async (parentId, slug, excludeId = null) => {
  const whereClause = { parentId: parentId || null, slug, ...activeCondition };
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

export const findPageByFullPath = async (fullPath, includeParams = PAGES_PUBLIC_INCLUDE) => {
  return await prisma.page.findFirst({
    where: { fullPath, ...activeCondition },
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
      fullPath: page.fullPath,
      excerpt: page.excerpt,
      content: page.content,
      status: page.status,
      template: page.template,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      metaKeywords: page.metaKeywords,
      featuredImageId: page.featuredImageId,
      parentId: page.parentId,
      menuOrder: page.menuOrder,
      showInMenu: page.showInMenu,
      includeInSitemap: page.includeInSitemap,
      noIndex: page.noIndex,
      noFollow: page.noFollow,
      canonicalUrl: page.canonicalUrl,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImageId: page.ogImageId,
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
  const timestamp = Date.now();
  const mutatedSlug = `${page.slug}__deleted__${timestamp}`;
  const mutatedFullPath = `${page.fullPath}__deleted__${timestamp}`;

  return await prisma.page.update({
    where: { id: page.id },
    data: {
      slug: mutatedSlug,
      fullPath: mutatedFullPath,
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
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { fullPath: { contains: search, mode: "insensitive" } },
      { metaTitle: { contains: search, mode: "insensitive" } }
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

export const buildPageTree = async (onlyPublished = false, onlyInMenu = false) => {
  const where = { deletedAt: null };
  if (onlyPublished) where.status = "PUBLISHED";
  if (onlyInMenu) where.showInMenu = true;

  const flatPages = await prisma.page.findMany({
    where,
    orderBy: { menuOrder: 'asc' }, 
    select: {
      id: true,
      title: true,
      slug: true,
      fullPath: true,
      parentId: true,
      menuOrder: true,
      showInMenu: true,
      status: true,
    }
  });

  const pageMap = {};
  const rootPages = [];

  flatPages.forEach(page => {
    pageMap[page.id] = { ...page, children: [] };
  });

  flatPages.forEach(page => {
    if (page.parentId && pageMap[page.parentId]) {
      pageMap[page.parentId].children.push(pageMap[page.id]);
    } else {
      rootPages.push(pageMap[page.id]);
    }
  });

  return rootPages;
};

export const getPageBreadcrumbs = async (pageId) => {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { fullPath: true }
  });

  if (!page || !page.fullPath || page.fullPath === '/') return [];

  const segments = page.fullPath.split('/').filter(Boolean);
  const pathsToFetch = [];
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    pathsToFetch.push(currentPath);
  }

  const rawNodes = await prisma.page.findMany({
    where: { fullPath: { in: pathsToFetch }, deletedAt: null },
    select: { id: true, title: true, slug: true, fullPath: true }
  });

  return pathsToFetch
    .map(p => rawNodes.find(node => node.fullPath === p))
    .filter(Boolean);
};

export const hasActiveChildren = async (parentId) => {
  const count = await prisma.page.count({
    where: { parentId, deletedAt: null }
  });
  return count > 0;
};

export const findPageRevisionHistory = async (pageId) => {
  return await prisma.pageRevision.findMany({
    where: { pageId },
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: { id: true, name: true, email: true, avatar: true }
      }
    }
  });
};

export const findPageRevisionById = async (pageId, revisionId) => {
  return await prisma.pageRevision.findFirst({
    where: { id: revisionId, pageId },
    include: {
      actor: {
        select: { id: true, name: true }
      }
    }
  });
};

export const restorePageContentSnapshot = async (pageId, snapshotData, actorId) => {
  return await prisma.$transaction(async (tx) => {
    const updatedPage = await tx.page.update({
      where: { id: pageId },
      data: {
        title: snapshotData.title,
        slug: snapshotData.slug,
        fullPath: snapshotData.fullPath,
        excerpt: snapshotData.excerpt,
        content: snapshotData.content,
        status: snapshotData.status,
        template: snapshotData.template,
        metaTitle: snapshotData.metaTitle,
        metaDescription: snapshotData.metaDescription,
        metaKeywords: snapshotData.metaKeywords,
        featuredImageId: snapshotData.featuredImageId,
        parentId: snapshotData.parentId,
        menuOrder: snapshotData.menuOrder || 0,
        showInMenu: snapshotData.showInMenu !== undefined ? snapshotData.showInMenu : true,
        includeInSitemap: snapshotData.includeInSitemap !== undefined ? snapshotData.includeInSitemap : true,
        noIndex: snapshotData.noIndex !== undefined ? snapshotData.noIndex : false,
        noFollow: snapshotData.noFollow !== undefined ? snapshotData.noFollow : false,
        canonicalUrl: snapshotData.canonicalUrl || null,
        ogTitle: snapshotData.ogTitle || null,
        ogDescription: snapshotData.ogDescription || null,
        ogImageId: snapshotData.ogImageId || null,
        updatedById: actorId,
      },
      include: PAGES_ADMIN_INCLUDE
    });

    await tx.pageRevision.create({
      data: {
        pageId,
        snapshot: snapshotData,
        actorId,
      }
    });

    return updatedPage;
  });
};

export const findActiveChildrenByParentId = async (parentId) => {
  return await prisma.page.findMany({
    where: { parentId, deletedAt: null }
  });
};

export const getPagesForSitemap = async () => {
  return await prisma.page.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      includeInSitemap: true,
      noIndex: false
    },
    select: {
      fullPath: true,
      publishedAt: true,
      updatedAt: true
    }
  });
};

export const createPagePathHistory = async (pageId, oldFullPath) => {
  return await prisma.pagePathHistory.create({
    data: { pageId, oldFullPath }
  });
};

export const findPageIdByOldPath = async (oldFullPath) => {
  const history = await prisma.pagePathHistory.findUnique({
    where: { oldFullPath },
    include: { page: { select: { fullPath: true, status: true, deletedAt: null } } }
  });
  return history;
};