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

// Checks if a specific absolute URL path is already claimed globally by an active page.
export const checkFullPathExists = async (fullPath, excludeId = null) => {
  const whereClause = { fullPath, ...activeCondition };
  if (excludeId) whereClause.id = { not: excludeId };
  
  const page = await prisma.page.findFirst({
    where: whereClause,
    select: { id: true }
  });
  return !!page;
};

//  Enforces slug uniqueness strictly at the sibling level under the same parent directory branch.
export const checkSiblingSlugExists = async (parentId, slug, excludeId = null) => {
  const whereClause = { parentId: parentId || null, slug, ...activeCondition };
  if (excludeId) whereClause.id = { not: excludeId };
  
  const page = await prisma.page.findFirst({
    where: whereClause,
    select: { id: true }
  });
  return !!page;
};

// Retreives a specific active page mapping for admin panel contexts using its unique CUID.

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

//  Transactional Creation Engine: Materializes the core living page and generates initial v1 historical snapshot.
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

// Transactional Mutation Engine: Writes updates to the main entry and logs a tracking revision state if context changed.
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

// Soft Deletes a target layout and mutates structural slugs uniquely to unblock future path claims instantly.
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

// Extracts list payloads supporting complex search queries, filtering boundaries, and pagination metrics.
export const findPagesList = async ({ skip, take, search, status, template, authorId, sortBy, sortOrder }) => {
  const where = { ...activeCondition };

  if (status) where.status = status;
  if (template) where.template = template;
  if (authorId) where.authorId = authorId;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
      { fullPath: { contains: search } },
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

//Combines flat directory data into multidimensional array node trees in O(N) memory runtime.
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

  const breadcrumbs = await prisma.page.findMany({
    where: { fullPath: { in: pathsToFetch }, deletedAt: null },
    orderBy: { fullPath: 'asc' },
    select: { id: true, title: true, slug: true, fullPath: true }
  });

  return breadcrumbs;
};

export const hasActiveChildren = async (parentId) => {
  const count = await prisma.page.count({
    where: { parentId, deletedAt: null }
  });
  return count > 0;
};


// VERSION REVISIONS SUBSYSTEM IMPLEMENTATIONS

// Compiles a sorted timeline of every logged historical revision captured for a distinct system page layout.
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

// Extracts a definitive atomic snapshot checkpoint logging log context based on targeting IDs parameters.
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

// System Workspaces Execution Rollback Database Transaction Component Layer.
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