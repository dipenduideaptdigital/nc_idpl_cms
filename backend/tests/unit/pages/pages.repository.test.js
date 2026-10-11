
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, tx } = vi.hoisted(() => {
  const tx = {
    page: {
      create: vi.fn(),
      update: vi.fn(),
    },
    pageRevision: {
      create: vi.fn(),
    },
  };

  const prisma = {
    page: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    pageRevision: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    pagePathHistory: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  return { prisma, tx };
});

vi.mock("../../../src/config/db.js", () => ({
  prisma,
}));

import {
  PAGES_ADMIN_INCLUDE,
  PAGES_PUBLIC_INCLUDE,
  checkFullPathExists,
  checkSiblingSlugExists,
  findPageById,
  findPageByFullPath,
  createPageWithRevision,
  updatePageWithRevision,
  softDeletePage,
  findPagesList,
  buildPageTree,
  getPageBreadcrumbs,
  hasActiveChildren,
  findPageRevisionHistory,
  findPageRevisionById,
  restorePageContentSnapshot,
  findActiveChildrenByParentId,
  getPagesForSitemap,
  createPagePathHistory,
  findPageIdByOldPath,
} from "../../../src/modules/pages/pages.repository.js";

describe("Pages Repository", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Simulate Prisma's interactive transaction callback.
    prisma.$transaction.mockImplementation(async (callback) => callback(tx));
  });

  describe("Include configurations", () => {
    it("should expose the expected admin relations", () => {
      expect(PAGES_ADMIN_INCLUDE).toEqual({
        author: {
          select: { id: true, name: true, email: true },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            mimeType: true,
          },
        },
        ogImage: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            mimeType: true,
          },
        },
      });
    });

    it("should expose only public-safe author and image fields", () => {
      expect(PAGES_PUBLIC_INCLUDE).toEqual({
        author: {
          select: { name: true },
        },
        featuredImage: {
          select: { url: true, thumbnailUrl: true },
        },
        ogImage: {
          select: { url: true, thumbnailUrl: true },
        },
      });
    });
  });

  describe("checkFullPathExists()", () => {
    it("should return true when an active page owns the full path", async () => {
      prisma.page.findFirst.mockResolvedValue({ id: "page-1" });

      await expect(checkFullPathExists("/about")).resolves.toBe(true);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          fullPath: "/about",
          deletedAt: null,
        },
        select: { id: true },
      });
    });

    it("should return false when no matching active page exists", async () => {
      prisma.page.findFirst.mockResolvedValue(null);

      await expect(checkFullPathExists("/about")).resolves.toBe(false);
    });

    it("should exclude the current page during an update", async () => {
      prisma.page.findFirst.mockResolvedValue(null);

      await checkFullPathExists("/about", "page-1");

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          fullPath: "/about",
          deletedAt: null,
          id: { not: "page-1" },
        },
        select: { id: true },
      });
    });

    it("should propagate database errors", async () => {
      prisma.page.findFirst.mockRejectedValue(new Error("Database unavailable"));

      await expect(checkFullPathExists("/about")).rejects.toThrow(
        "Database unavailable"
      );
    });
  });

  describe("checkSiblingSlugExists()", () => {
    it("should check a root-level slug using parentId null", async () => {
      prisma.page.findFirst.mockResolvedValue({ id: "page-1" });

      await expect(
        checkSiblingSlugExists(undefined, "about")
      ).resolves.toBe(true);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          parentId: null,
          slug: "about",
          deletedAt: null,
        },
        select: { id: true },
      });
    });

    it("should check a child slug under the specified parent", async () => {
      prisma.page.findFirst.mockResolvedValue(null);

      await checkSiblingSlugExists("parent-1", "services");

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          parentId: "parent-1",
          slug: "services",
          deletedAt: null,
        },
        select: { id: true },
      });
    });

    it("should exclude the current page when checking an existing slug", async () => {
      prisma.page.findFirst.mockResolvedValue(null);

      await checkSiblingSlugExists("parent-1", "services", "page-1");

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          parentId: "parent-1",
          slug: "services",
          deletedAt: null,
          id: { not: "page-1" },
        },
        select: { id: true },
      });
    });

    it("should propagate database errors", async () => {
      prisma.page.findFirst.mockRejectedValue(new Error("Query failed"));

      await expect(checkSiblingSlugExists(null, "about")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("findPageById()", () => {
    it("should query only active pages and include admin relations by default", async () => {
      const page = { id: "page-1", title: "About" };
      prisma.page.findFirst.mockResolvedValue(page);

      await expect(findPageById("page-1")).resolves.toBe(page);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          id: "page-1",
          deletedAt: null,
        },
        include: PAGES_ADMIN_INCLUDE,
      });
    });

    it("should support custom include parameters", async () => {
      const customInclude = { author: true };
      prisma.page.findFirst.mockResolvedValue(null);

      await findPageById("page-1", customInclude);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          id: "page-1",
          deletedAt: null,
        },
        include: customInclude,
      });
    });
  });

  describe("findPageByFullPath()", () => {
    it("should query active pages using the public include configuration", async () => {
      const page = { id: "page-1", fullPath: "/about" };
      prisma.page.findFirst.mockResolvedValue(page);

      await expect(findPageByFullPath("/about")).resolves.toBe(page);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          fullPath: "/about",
          deletedAt: null,
        },
        include: PAGES_PUBLIC_INCLUDE,
      });
    });

    it("should support a custom include configuration", async () => {
      const customInclude = { featuredImage: true };
      prisma.page.findFirst.mockResolvedValue(null);

      await findPageByFullPath("/about", customInclude);

      expect(prisma.page.findFirst).toHaveBeenCalledWith({
        where: {
          fullPath: "/about",
          deletedAt: null,
        },
        include: customInclude,
      });
    });
  });

  describe("createPageWithRevision()", () => {
    it("should create the page and its initial revision in one transaction", async () => {
      const pageData = {
        title: "About",
        slug: "about",
        fullPath: "/about",
        status: "DRAFT",
        content: { blocks: [] },
        templateKey: "default",
        templateVersion: 1,
        featuredImageId: null,
        ogImageId: null,
      };

      const createdPage = {
        id: "page-1",
        ...pageData,
      };

      tx.page.create.mockResolvedValue(createdPage);
      tx.pageRevision.create.mockResolvedValue({ id: "revision-1" });

      const result = await createPageWithRevision(pageData, "admin-1");

      expect(prisma.$transaction).toHaveBeenCalledOnce();

      expect(tx.page.create).toHaveBeenCalledWith({
        data: pageData,
        include: PAGES_ADMIN_INCLUDE,
      });

      expect(tx.pageRevision.create).toHaveBeenCalledWith({
        data: {
          pageId: "page-1",
          actorId: "admin-1",
          snapshot: {
            title: "About",
            slug: "about",
            fullPath: "/about",
            excerpt: undefined,
            content: { blocks: [] },
            status: "DRAFT",
            template: undefined,
            templateKey: "default",
            templateVersion: 1,
            metaTitle: undefined,
            metaDescription: undefined,
            metaKeywords: undefined,
            featuredImageId: null,
            parentId: undefined,
            menuOrder: undefined,
            showInMenu: undefined,
            includeInSitemap: undefined,
            noIndex: undefined,
            noFollow: undefined,
            canonicalUrl: undefined,
            ogTitle: undefined,
            ogDescription: undefined,
            ogImageId: null,
          },
        },
      });

      expect(result).toBe(createdPage);
    });

    it("should reject if page creation fails without creating a revision", async () => {
      tx.page.create.mockRejectedValue(new Error("Page creation failed"));

      await expect(
        createPageWithRevision({ title: "About" }, "admin-1")
      ).rejects.toThrow("Page creation failed");

      expect(tx.pageRevision.create).not.toHaveBeenCalled();
    });

    it("should reject if revision creation fails", async () => {
      tx.page.create.mockResolvedValue({
        id: "page-1",
        title: "About",
      });
      tx.pageRevision.create.mockRejectedValue(
        new Error("Revision creation failed")
      );

      await expect(
        createPageWithRevision({ title: "About" }, "admin-1")
      ).rejects.toThrow("Revision creation failed");

      // This verifies the repository propagates the transaction callback
      // failure. Actual rollback semantics belong in a database integration test.
    });
  });

  describe("updatePageWithRevision()", () => {
    it("should update the page and create a revision when a snapshot is provided", async () => {
      const updateData = { title: "Updated About" };
      const snapshot = { title: "Updated About", fullPath: "/about" };
      const updatedPage = { id: "page-1", ...updateData };

      tx.page.update.mockResolvedValue(updatedPage);
      tx.pageRevision.create.mockResolvedValue({ id: "revision-2" });

      const result = await updatePageWithRevision(
        "page-1",
        updateData,
        snapshot,
        "admin-1"
      );

      expect(prisma.$transaction).toHaveBeenCalledOnce();
      expect(tx.page.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: updateData,
        include: PAGES_ADMIN_INCLUDE,
      });

      expect(tx.pageRevision.create).toHaveBeenCalledWith({
        data: {
          pageId: "page-1",
          snapshot,
          actorId: "admin-1",
        },
      });

      expect(result).toBe(updatedPage);
    });

    it("should not create a revision when snapshot is null", async () => {
      const updatedPage = { id: "page-1", title: "Updated" };
      tx.page.update.mockResolvedValue(updatedPage);

      await updatePageWithRevision(
        "page-1",
        { title: "Updated" },
        null,
        "admin-1"
      );

      expect(tx.page.update).toHaveBeenCalledOnce();
      expect(tx.pageRevision.create).not.toHaveBeenCalled();
    });

    it("should propagate update errors", async () => {
      tx.page.update.mockRejectedValue(new Error("Update failed"));

      await expect(
        updatePageWithRevision("page-1", {}, null, "admin-1")
      ).rejects.toThrow("Update failed");

      expect(tx.pageRevision.create).not.toHaveBeenCalled();
    });
  });

  describe("softDeletePage()", () => {
    it("should archive the page and mutate its slug and full path", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-11T00:00:00.000Z"));

      const page = {
        id: "page-1",
        slug: "about",
        fullPath: "/about",
      };

      const result = { id: "page-1", status: "ARCHIVED" };
      prisma.page.update.mockResolvedValue(result);

      await expect(softDeletePage(page, "admin-1")).resolves.toBe(result);

      expect(prisma.page.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: {
          slug: "about__deleted__1791676800000",
          fullPath: "/about__deleted__1791676800000",
          deletedAt: new Date("2026-10-11T00:00:00.000Z"),
          status: "ARCHIVED",
          updatedById: "admin-1",
        },
      });

      vi.useRealTimers();
    });

    it("should propagate database errors", async () => {
      prisma.page.update.mockRejectedValue(new Error("Delete failed"));

      await expect(
        softDeletePage(
          { id: "page-1", slug: "about", fullPath: "/about" },
          "admin-1"
        )
      ).rejects.toThrow("Delete failed");
    });
  });

  describe("findPagesList()", () => {
    it("should query active pages with pagination, sorting and admin includes", async () => {
      const pages = [{ id: "page-1" }];
      prisma.page.findMany.mockResolvedValue(pages);
      prisma.page.count.mockResolvedValue(1);

      const result = await findPagesList({
        skip: 10,
        take: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const expectedWhere = { deletedAt: null };

      expect(prisma.page.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 10,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: PAGES_ADMIN_INCLUDE,
      });

      expect(prisma.page.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });

      expect(result).toEqual({ pages, total: 1 });
    });

    it("should apply status, template, author and parent filters", async () => {
      prisma.page.findMany.mockResolvedValue([]);
      prisma.page.count.mockResolvedValue(0);

      await findPagesList({
        skip: 0,
        take: 20,
        status: "PUBLISHED",
        template: "landing",
        authorId: "author-1",
        parentId: null,
        sortBy: "title",
        sortOrder: "asc",
      });

      const expectedWhere = {
        deletedAt: null,
        status: "PUBLISHED",
        template: "landing",
        authorId: "author-1",
        parentId: null,
      };

      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedWhere })
      );
      expect(prisma.page.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
    });

    it("should apply search across title, slug, fullPath and metaTitle", async () => {
      prisma.page.findMany.mockResolvedValue([]);
      prisma.page.count.mockResolvedValue(0);

      await findPagesList({
        skip: 0,
        take: 10,
        search: "contact",
        sortBy: "title",
        sortOrder: "asc",
      });

      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            OR: [
              { title: { contains: "contact" } },
              { slug: { contains: "contact" } },
              { fullPath: { contains: "contact" } },
              { metaTitle: { contains: "contact" } },
            ],
          },
        })
      );
    });

    it("should apply all supplied filters together", async () => {
      prisma.page.findMany.mockResolvedValue([]);
      prisma.page.count.mockResolvedValue(0);

      await findPagesList({
        skip: 0,
        take: 10,
        search: "services",
        status: "PUBLISHED",
        template: "default",
        authorId: "author-1",
        parentId: "parent-1",
        sortBy: "updatedAt",
        sortOrder: "desc",
      });

      expect(prisma.page.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
          template: "default",
          authorId: "author-1",
          parentId: "parent-1",
          OR: [
            { title: { contains: "services" } },
            { slug: { contains: "services" } },
            { fullPath: { contains: "services" } },
            { metaTitle: { contains: "services" } },
          ],
        },
      });
    });

    it("should reject if a list or count query fails", async () => {
      prisma.page.findMany.mockRejectedValue(new Error("List query failed"));
      prisma.page.count.mockResolvedValue(0);

      await expect(
        findPagesList({
          skip: 0,
          take: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      ).rejects.toThrow("List query failed");
    });
  });

  describe("buildPageTree()", () => {
    it("should build a nested tree while preserving the database order", async () => {
      prisma.page.findMany.mockResolvedValue([
        {
          id: "root-1",
          title: "Services",
          parentId: null,
          menuOrder: 1,
        },
        {
          id: "child-1",
          title: "Web Development",
          parentId: "root-1",
          menuOrder: 2,
        },
        {
          id: "grandchild-1",
          title: "React",
          parentId: "child-1",
          menuOrder: 3,
        },
        {
          id: "root-2",
          title: "About",
          parentId: null,
          menuOrder: 4,
        },
      ]);

      const result = await buildPageTree();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("root-1");
      expect(result[0].children[0].id).toBe("child-1");
      expect(result[0].children[0].children[0].id).toBe("grandchild-1");
      expect(result[1].id).toBe("root-2");
      expect(prisma.page.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { menuOrder: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          fullPath: true,
          parentId: true,
          menuOrder: true,
          showInMenu: true,
          status: true,
        },
      });
    });

    it("should filter to published pages when requested", async () => {
      prisma.page.findMany.mockResolvedValue([]);

      await buildPageTree(true, false);

      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            status: "PUBLISHED",
          },
        })
      );
    });

    it("should filter to menu pages when requested", async () => {
      prisma.page.findMany.mockResolvedValue([]);

      await buildPageTree(false, true);

      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            showInMenu: true,
          },
        })
      );
    });

    it("should combine published and menu filters", async () => {
      prisma.page.findMany.mockResolvedValue([]);

      await buildPageTree(true, true);

      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            status: "PUBLISHED",
            showInMenu: true,
          },
        })
      );
    });

    it("should treat a page whose parent is missing from the result as a root", async () => {
      prisma.page.findMany.mockResolvedValue([
        {
          id: "orphan",
          title: "Orphan",
          parentId: "missing-parent",
          menuOrder: 1,
        },
      ]);

      const result = await buildPageTree();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("orphan");
      expect(result[0].children).toEqual([]);
    });

    it("should return an empty tree when no pages exist", async () => {
      prisma.page.findMany.mockResolvedValue([]);

      await expect(buildPageTree()).resolves.toEqual([]);
    });
  });

  describe("getPageBreadcrumbs()", () => {
    it("should return an empty array when the page does not exist", async () => {
      prisma.page.findUnique.mockResolvedValue(null);

      await expect(getPageBreadcrumbs("missing")).resolves.toEqual([]);

      expect(prisma.page.findMany).not.toHaveBeenCalled();
    });

    it("should return an empty array for a root path", async () => {
      prisma.page.findUnique.mockResolvedValue({ fullPath: "/" });

      await expect(getPageBreadcrumbs("root")).resolves.toEqual([]);

      expect(prisma.page.findMany).not.toHaveBeenCalled();
    });

    it("should construct ancestor paths and return breadcrumbs in hierarchy order", async () => {
      prisma.page.findUnique.mockResolvedValue({
        fullPath: "/services/web/react",
      });

      const nodes = [
        { id: "react", fullPath: "/services/web/react" },
        { id: "services", fullPath: "/services" },
        { id: "web", fullPath: "/services/web" },
      ];
      prisma.page.findMany.mockResolvedValue(nodes);

      const result = await getPageBreadcrumbs("react");

      expect(prisma.page.findMany).toHaveBeenCalledWith({
        where: {
          fullPath: {
            in: ["/services", "/services/web", "/services/web/react"],
          },
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          fullPath: true,
        },
      });

      expect(result.map((page) => page.fullPath)).toEqual([
        "/services",
        "/services/web",
        "/services/web/react",
      ]);
    });

    it("should omit ancestor paths whose active pages are missing", async () => {
      prisma.page.findUnique.mockResolvedValue({
        fullPath: "/services/web/react",
      });
      prisma.page.findMany.mockResolvedValue([
        { id: "react", fullPath: "/services/web/react" },
      ]);

      const result = await getPageBreadcrumbs("react");

      expect(result).toEqual([
        { id: "react", fullPath: "/services/web/react" },
      ]);
    });
  });

  describe("hasActiveChildren()", () => {
    it("should return true when at least one active child exists", async () => {
      prisma.page.count.mockResolvedValue(1);

      await expect(hasActiveChildren("parent-1")).resolves.toBe(true);

      expect(prisma.page.count).toHaveBeenCalledWith({
        where: {
          parentId: "parent-1",
          deletedAt: null,
        },
      });
    });

    it("should return false when no active children exist", async () => {
      prisma.page.count.mockResolvedValue(0);

      await expect(hasActiveChildren("parent-1")).resolves.toBe(false);
    });
  });

  describe("findPageRevisionHistory()", () => {
    it("should return revisions newest-first with actor details", async () => {
      const revisions = [{ id: "revision-1" }];
      prisma.pageRevision.findMany.mockResolvedValue(revisions);

      await expect(findPageRevisionHistory("page-1")).resolves.toBe(revisions);

      expect(prisma.pageRevision.findMany).toHaveBeenCalledWith({
        where: { pageId: "page-1" },
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    });
  });

  describe("findPageRevisionById()", () => {
    it("should scope a revision lookup to both page ID and revision ID", async () => {
      const revision = { id: "revision-1", pageId: "page-1" };
      prisma.pageRevision.findFirst.mockResolvedValue(revision);

      await expect(
        findPageRevisionById("page-1", "revision-1")
      ).resolves.toBe(revision);

      expect(prisma.pageRevision.findFirst).toHaveBeenCalledWith({
        where: {
          id: "revision-1",
          pageId: "page-1",
        },
        include: {
          actor: {
            select: { id: true, name: true },
          },
        },
      });
    });

    it("should return null when the revision does not belong to the page", async () => {
      prisma.pageRevision.findFirst.mockResolvedValue(null);

      await expect(
        findPageRevisionById("page-1", "revision-from-another-page")
      ).resolves.toBeNull();
    });
  });

  describe("restorePageContentSnapshot()", () => {
    it("should restore the snapshot and create a revision in one transaction", async () => {
      const snapshot = {
        title: "Restored About",
        slug: "about",
        fullPath: "/about",
        excerpt: "About us",
        content: { blocks: [] },
        status: "PUBLISHED",
        template: "default",
        templateKey: "default",
        templateVersion: 2,
        metaTitle: "About",
        metaDescription: "About our company",
        metaKeywords: "about, company",
        featuredImageId: "image-1",
        parentId: null,
        menuOrder: 2,
        showInMenu: false,
        includeInSitemap: false,
        noIndex: true,
        noFollow: true,
        canonicalUrl: "https://example.com/about",
        ogTitle: "About",
        ogDescription: "About us",
        ogImageId: "image-2",
      };

      const restoredPage = { id: "page-1", ...snapshot };
      tx.page.update.mockResolvedValue(restoredPage);
      tx.pageRevision.create.mockResolvedValue({ id: "revision-2" });

      const result = await restorePageContentSnapshot(
        "page-1",
        snapshot,
        "admin-1"
      );

      expect(tx.page.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: {
          ...snapshot,
          updatedById: "admin-1",
        },
        include: PAGES_ADMIN_INCLUDE,
      });

      expect(tx.pageRevision.create).toHaveBeenCalledWith({
        data: {
          pageId: "page-1",
          snapshot,
          actorId: "admin-1",
        },
      });

      expect(result).toBe(restoredPage);
      expect(prisma.$transaction).toHaveBeenCalledOnce();
    });

    it("should apply defaults for absent or falsy optional snapshot values", async () => {
      tx.page.update.mockResolvedValue({ id: "page-1" });
      tx.pageRevision.create.mockResolvedValue({});

      await restorePageContentSnapshot(
        "page-1",
        {
          title: "Restored",
          slug: "restored",
          fullPath: "/restored",
          templateKey: "",
          templateVersion: 0,
          menuOrder: 0,
          canonicalUrl: "",
          ogTitle: "",
          ogDescription: "",
          ogImageId: "",
        },
        "admin-1"
      );

      expect(tx.page.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: expect.objectContaining({
          templateKey: null,
          templateVersion: 1,
          menuOrder: 0,
          showInMenu: true,
          includeInSitemap: true,
          noIndex: false,
          noFollow: false,
          canonicalUrl: null,
          ogTitle: null,
          ogDescription: null,
          ogImageId: null,
          updatedById: "admin-1",
        }),
        include: PAGES_ADMIN_INCLUDE,
      });
    });

    it("should preserve explicit false values in snapshot settings", async () => {
      tx.page.update.mockResolvedValue({ id: "page-1" });
      tx.pageRevision.create.mockResolvedValue({});

      await restorePageContentSnapshot(
        "page-1",
        {
          title: "Restored",
          slug: "restored",
          fullPath: "/restored",
          showInMenu: false,
          includeInSitemap: false,
          noIndex: false,
          noFollow: false,
        },
        "admin-1"
      );

      expect(tx.page.update).toHaveBeenCalledWith({
        where: { id: "page-1" },
        data: expect.objectContaining({
          showInMenu: false,
          includeInSitemap: false,
          noIndex: false,
          noFollow: false,
        }),
        include: PAGES_ADMIN_INCLUDE,
      });
    });

    it("should propagate revision creation failures", async () => {
      tx.page.update.mockResolvedValue({ id: "page-1" });
      tx.pageRevision.create.mockRejectedValue(
        new Error("Revision creation failed")
      );

      await expect(
        restorePageContentSnapshot(
          "page-1",
          { title: "Restored", slug: "restored", fullPath: "/restored" },
          "admin-1"
        )
      ).rejects.toThrow("Revision creation failed");
    });
  });

  describe("findActiveChildrenByParentId()", () => {
    it("should return only non-deleted children of the requested parent", async () => {
      const children = [{ id: "child-1" }];
      prisma.page.findMany.mockResolvedValue(children);

      await expect(
        findActiveChildrenByParentId("parent-1")
      ).resolves.toBe(children);

      expect(prisma.page.findMany).toHaveBeenCalledWith({
        where: {
          parentId: "parent-1",
          deletedAt: null,
        },
      });
    });
  });

  describe("getPagesForSitemap()", () => {
    it("should include only published, active, indexable pages", async () => {
      const pages = [{ fullPath: "/about" }];
      prisma.page.findMany.mockResolvedValue(pages);

      await expect(getPagesForSitemap()).resolves.toBe(pages);

      expect(prisma.page.findMany).toHaveBeenCalledWith({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          includeInSitemap: true,
          noIndex: false,
        },
        select: {
          fullPath: true,
          publishedAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe("createPagePathHistory()", () => {
    it("should persist the old path for the specified page", async () => {
      const history = {
        pageId: "page-1",
        oldFullPath: "/old-about",
      };
      prisma.pagePathHistory.create.mockResolvedValue(history);

      await expect(
        createPagePathHistory("page-1", "/old-about")
      ).resolves.toBe(history);

      expect(prisma.pagePathHistory.create).toHaveBeenCalledWith({
        data: {
          pageId: "page-1",
          oldFullPath: "/old-about",
        },
      });
    });
  });

  describe("findPageIdByOldPath()", () => {
    it("should find the path history and include current page details", async () => {
      const history = {
        oldFullPath: "/old-about",
        page: {
          fullPath: "/about",
          status: "PUBLISHED",
          deletedAt: null,
        },
      };
      prisma.pagePathHistory.findUnique.mockResolvedValue(history);

      await expect(
        findPageIdByOldPath("/old-about")
      ).resolves.toBe(history);

      expect(prisma.pagePathHistory.findUnique).toHaveBeenCalledWith({
        where: { oldFullPath: "/old-about" },
        include: {
          page: {
            select: {
              fullPath: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      });
    });

    it("should return null when no history exists for the old path", async () => {
      prisma.pagePathHistory.findUnique.mockResolvedValue(null);

      await expect(
        findPageIdByOldPath("/missing-path")
      ).resolves.toBeNull();
    });
  });
});
