import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as pagesService from "../../../src/modules/pages/pages.service.js";
import * as repo from "../../../src/modules/pages/pages.repository.js";
import { findMediaById } from "../../../src/modules/blogs/blogs.repository.js";

// Mock boundaries
vi.mock("../../../src/modules/pages/pages.repository.js");
vi.mock("../../../src/modules/blogs/blogs.repository.js", () => ({
  findMediaById: vi.fn()
}));

describe("Pages Service", () => {
  const actorId = "admin-123";

  beforeEach(() => {
    vi.resetAllMocks();
    repo.findActiveChildrenByParentId.mockResolvedValue([]);
    repo.createPagePathHistory.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createNewPage()", () => {
    it("C01 & C02: should create root page generating slug from title if slug not provided", async () => {
      repo.findPageById.mockResolvedValue(null);
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.createPageWithRevision.mockResolvedValue({ id: "page_1", title: "About Us", slug: "about-us", fullPath: "/about-us", status: "DRAFT" });

      const result = await pagesService.createNewPage({ title: "About Us", status: "DRAFT" }, actorId);

      expect(repo.checkSiblingSlugExists).toHaveBeenCalledWith(undefined, "about-us", null);
      expect(repo.createPageWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "about-us", fullPath: "/about-us", publishedAt: null }),
        actorId
      );
      expect(result.id).toBe("page_1");
    });

    it("C04: should generate unique sibling slug using suffixes if base slug exists", async () => {
      repo.checkSiblingSlugExists
        .mockResolvedValueOnce(true)   // about exists
        .mockResolvedValueOnce(true)   // about-1 exists
        .mockResolvedValueOnce(false); // about-2 available
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.createPageWithRevision.mockResolvedValue({ id: "p2" });

      await pagesService.createNewPage({ title: "About" }, actorId);

      expect(repo.createPageWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "about-2", fullPath: "/about-2" }),
        actorId
      );
    });

    it("C07: should throw 404 if parent page is not found", async () => {
      repo.findPageById.mockResolvedValue(null);
      await expect(pagesService.createNewPage({ title: "Child", parentId: "bad-id" }, actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
    });

    it("C06: should append parent fullPath if parent exists", async () => {
      repo.findPageById.mockResolvedValue({ id: "parent_1", fullPath: "/services" });
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.createPageWithRevision.mockResolvedValue({ id: "p3" });

      await pagesService.createNewPage({ title: "Web Dev", parentId: "parent_1" }, actorId);

      expect(repo.createPageWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ fullPath: "/services/web-dev" }),
        actorId
      );
    });

    it("C08: should throw 409 if final full path is already taken", async () => {
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(true);

      await expect(pagesService.createNewPage({ title: "Home" }, actorId))
        .rejects.toThrow(/URL path \/home is already in use/);
    });

    it("C09 & C10: should set publishedAt properly based on status", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-10-09T10:00:00.000Z");
      vi.setSystemTime(now);

      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.createPageWithRevision.mockResolvedValue({ id: "p4" });

      await pagesService.createNewPage({ title: "Pub", status: "PUBLISHED" }, actorId);
      
      expect(repo.createPageWithRevision).toHaveBeenCalledWith(
        expect.objectContaining({ publishedAt: now }), actorId
      );
    });

    it("C13: should throw 400 if featured image asset is missing", async () => {
      findMediaById.mockResolvedValue(null);
      await expect(pagesService.createNewPage({ title: "T", featuredImageId: "img1" }, actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 400 }));
    });

    it("C14: should throw 400 if featured image has a non-image mime type", async () => {
      findMediaById.mockResolvedValue({ mimeType: "application/pdf" });
      await expect(pagesService.createNewPage({ title: "T", featuredImageId: "img2" }, actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 400 }));
    });

    it("C12: should successfully create page if featured image is valid", async () => {
      findMediaById.mockResolvedValue({ mimeType: "image/jpeg" });
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.createPageWithRevision.mockResolvedValue({ id: "p5", title: "T" });

      const result = await pagesService.createNewPage({ title: "T", featuredImageId: "img3" }, actorId);
      
      expect(result).toMatchObject({ id: "p5", title: "T" });
    });

    it("C15: should handle P2002 fullPath unique constraint database error gracefully", async () => {
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      
      const p2002Error = new Error("DB Error");
      p2002Error.code = "P2002";
      p2002Error.meta = { target: "fullPath" };
      repo.createPageWithRevision.mockRejectedValue(p2002Error);

      await expect(pagesService.createNewPage({ title: "Race Condition" }, actorId))
        .rejects.toThrow(/URL path was just taken by another process/);
    });
  });

  describe("updateExistingPage()", () => {
    const existingPage = { 
      id: "page_1", 
      title: "Old Title", 
      slug: "old-title", 
      fullPath: "/old-title", 
      status: "DRAFT",
      parentId: null
    };

    it("U01: should throw 404 if page does not exist", async () => {
      repo.findPageById.mockResolvedValue(null);
      await expect(pagesService.updateExistingPage("bad-id", { title: "New" }, actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
    });

    it("U02, U03 & U04: should update allowed fields, set updatedById, and drop unauthorized/unknown fields", async () => {
      repo.findPageById.mockResolvedValue(existingPage);
      repo.updatePageWithRevision.mockResolvedValue({ ...existingPage, title: "New Title" });

      await pagesService.updateExistingPage("page_1", { 
        title: "New Title", 
        hackerField: "malicious",
        authorId: "hacked-author",
        publishedAt: "2026-01-01"
      }, actorId);

      const updatePayload = repo.updatePageWithRevision.mock.calls[0][1];
      
      expect(updatePayload).toMatchObject({ title: "New Title", updatedById: actorId });
      expect(updatePayload.hackerField).toBeUndefined();
      expect(updatePayload.authorId).toBeUndefined();
      expect(updatePayload.publishedAt).toBeUndefined();
    });

    it("U09 & U12: should not regenerate slug if explicitly unchanged or published", async () => {
      repo.findPageById.mockResolvedValue({ ...existingPage, publishedAt: new Date() });
      repo.updatePageWithRevision.mockResolvedValue(existingPage);

      await pagesService.updateExistingPage("page_1", { title: "New Title" }, actorId);
      
      const updatePayload = repo.updatePageWithRevision.mock.calls[0][1];
      expect(updatePayload.slug).toBeUndefined();
      expect(updatePayload.fullPath).toBeUndefined();
      expect(repo.checkSiblingSlugExists).not.toHaveBeenCalled();
    });

    it("U15 & U16: should trigger path history and cascade to children if fullPath changes on published page", async () => {
      repo.findPageById.mockResolvedValue({ ...existingPage, publishedAt: new Date() });
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.updatePageWithRevision.mockResolvedValue(existingPage);
      
      repo.findActiveChildrenByParentId
        .mockResolvedValueOnce([{ id: "child_1", slug: "child", fullPath: "/old-title/child", publishedAt: new Date() }])
        .mockResolvedValue([]); // No deeper descendants

      await pagesService.updateExistingPage("page_1", { slug: "new-path" }, actorId);

      // Check path history creation
      expect(repo.createPagePathHistory).toHaveBeenCalledWith("page_1", "/old-title");
      
      // Check cascade
      expect(repo.findActiveChildrenByParentId).toHaveBeenCalledWith("page_1");
      expect(repo.updatePageWithRevision).toHaveBeenCalledWith(
        "child_1",
        expect.objectContaining({ fullPath: "/new-path/child" }),
        null, // newSnapshot
        actorId
      );
    });

    it("U18 & U21: should validate hierarchy circular dependency and depth", async () => {
      // Own parent
      repo.findPageById.mockResolvedValue(existingPage);
      await expect(pagesService.updateExistingPage("page_1", { parentId: "page_1" }, actorId))
        .rejects.toThrow(/A page cannot be its own parent/);

      let calls = 0;
      repo.findPageById.mockImplementation((id) => {
        if (id === "page_1") return existingPage;
        calls++;
        return { id, parentId: `parent_${calls + 1}` }; 
      });

      await expect(pagesService.updateExistingPage("page_1", { parentId: "parent_1" }, actorId))
        .rejects.toThrow(/Maximum hierarchy depth/);
    });

    it("U26 & U28: should handle scheduled updates on published pages cleanly", async () => {
      const pubPage = { ...existingPage, status: "PUBLISHED", publishedAt: new Date() };
      repo.findPageById.mockResolvedValue(pubPage);
      repo.updatePageWithRevision.mockResolvedValue(pubPage);

      const futureDate = new Date("2030-01-01T00:00:00.000Z").toISOString();
      await pagesService.updateExistingPage("page_1", { 
        title: "Future Title", 
        scheduledUpdateAt: futureDate 
      }, actorId);

      const updateData = repo.updatePageWithRevision.mock.calls[0][1];
      expect(updateData.scheduledUpdateData.title).toBe("Future Title");
      expect(updateData.scheduledUpdateAt).toEqual(new Date(futureDate));
      expect(updateData.title).toBeUndefined(); // Should not overwrite active title yet
    });
  });

  describe("duplicatePage() / duplicatePageDeep()", () => {
    it("D01: should throw 404 if original page not found", async () => {
      repo.findPageById.mockResolvedValue(null);
      await expect(pagesService.duplicatePage("bad-id", actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
    });

    it("D02, D08, D10: should deeply duplicate page and its children", async () => {
      const parentNode = { id: "p1", title: "Parent", content: { blocks: [{ type: "text" }] }, slug: "parent", fullPath: "/parent" };
      const childNode = { id: "c1", title: "Child", content: {}, slug: "child", fullPath: "/parent/child", parentId: "p1" };
      const newParentNode = { id: "new_p1", fullPath: "/parent-copy" }; // Needed for buildFullPath of child

      repo.findPageById.mockImplementation(async (id) => {
        if (id === "p1") return parentNode;
        if (id === "c1") return childNode;
        if (id === "new_p1") return newParentNode;
        return null;
      });
      
      repo.checkSiblingSlugExists.mockResolvedValue(false);
      
      // Mock create returns
      repo.createPageWithRevision
        .mockResolvedValueOnce({ id: "new_p1", title: "Parent (Copy)" })
        .mockResolvedValueOnce({ id: "new_c1", title: "Child" });

      repo.findActiveChildrenByParentId
        .mockResolvedValueOnce([childNode]) // parent has 1 child
        .mockResolvedValueOnce([]); // child has 0 children

      const result = await pagesService.duplicatePage("p1", actorId);

      expect(repo.createPageWithRevision).toHaveBeenNthCalledWith(1, 
        expect.objectContaining({ title: "Parent (Copy)", status: "DRAFT", fullPath: "/parent-copy" }), actorId
      );
      expect(repo.createPageWithRevision).toHaveBeenNthCalledWith(2, 
        expect.objectContaining({ title: "Child", parentId: "new_p1", fullPath: "/parent-copy/child" }), actorId
      );
      expect(result.id).toBe("new_p1");
    });
  });

  describe("deletePage()", () => {
    it("DEL01: should throw 404 if page does not exist", async () => {
      repo.findPageById.mockResolvedValue(null);
      await expect(pagesService.deletePage("bad-id", actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
    });

    it("DEL02: should throw 409 if page has active children", async () => {
      repo.findPageById.mockResolvedValue({ id: "p1" });
      repo.hasActiveChildren.mockResolvedValue(true);
      await expect(pagesService.deletePage("p1", actorId))
        .rejects.toThrow(expect.objectContaining({ statusCode: 409 }));
    });

    it("DEL03 & DEL04: should softly delete page if no active children exist", async () => {
      repo.findPageById.mockResolvedValue({ id: "p1" });
      repo.hasActiveChildren.mockResolvedValue(false);
      repo.softDeletePage.mockResolvedValue({ id: "p1", status: "ARCHIVED" });

      await pagesService.deletePage("p1", actorId);

      expect(repo.softDeletePage).toHaveBeenCalledWith({ id: "p1" }, actorId);
    });
  });

  describe("getPagesList()", () => {
    it("L01 - L05: should calculate pagination limits and wrap meta response", async () => {
      repo.findPagesList.mockResolvedValue({ pages: [{ id: "p1" }], total: 25 });
      
      const result = await pagesService.getPagesList({ page: 3, limit: 10 });

      expect(repo.findPagesList).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 10 }));
      expect(result.meta).toEqual({ page: 3, limit: 10, total: 25, totalPages: 3 });
    });
  });

  describe("getPublicPageByPath()", () => {
    it("PUB01 & PUB04: should format path and throw 404 if page is not found", async () => {
      repo.findPageByFullPath.mockResolvedValue(null);
      await expect(pagesService.getPublicPageByPath("about"))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
      // Prepending slash check
      expect(repo.findPageByFullPath).toHaveBeenCalledWith("/about");
    });

    it("PUB05: should throw 404 if page is found but status is not PUBLISHED", async () => {
      repo.findPageByFullPath.mockResolvedValue({ status: "DRAFT" });
      await expect(pagesService.getPublicPageByPath("/about"))
        .rejects.toThrow(expect.objectContaining({ statusCode: 404 }));
    });

    it("PUB03 & PUB07: should return public serialized page with breadcrumbs", async () => {
      repo.findPageByFullPath.mockResolvedValue({ id: "p1", status: "PUBLISHED", fullPath: "/about" });
      repo.getPageBreadcrumbs.mockResolvedValue([{ id: "p1", fullPath: "/about" }]);

      const result = await pagesService.getPublicPageByPath("/about");

      expect(result.breadcrumbs.length).toBe(1);
      expect(result.id).toBe("p1"); // serialized data
    });
  });

  describe("Revisions & Restoration", () => {
    it("R08 & R09: should prevent restoration if path is taken by another live process", async () => {
      const existingPage = { id: "p1", fullPath: "/new-path" };
      const revision = { id: "rev1", snapshot: { fullPath: "/old-path" } };
      
      repo.findPageById.mockResolvedValue(existingPage);
      repo.findPageRevisionById.mockResolvedValue(revision);
      
      repo.checkFullPathExists.mockResolvedValue(true); 

      await expect(pagesService.restorePageToRevision("p1", "rev1", actorId))
        .rejects.toThrow(/claimed by another active process/);
    });

    it("R09, R10: should restore snapshot and cascade descendant paths if fullPath changes", async () => {
      const existingPage = { id: "p1", fullPath: "/current-path" };
      const revision = { id: "rev1", snapshot: { fullPath: "/restored-path", title: "Restored" } };
      
      repo.findPageById.mockResolvedValue(existingPage);
      repo.findPageRevisionById.mockResolvedValue(revision);
      repo.checkFullPathExists.mockResolvedValue(false);
      repo.restorePageContentSnapshot.mockResolvedValue({ id: "p1", fullPath: "/restored-path" });
      repo.findActiveChildrenByParentId.mockResolvedValue([]);

      await pagesService.restorePageToRevision("p1", "rev1", actorId);

      expect(repo.restorePageContentSnapshot).toHaveBeenCalledWith("p1", revision.snapshot, actorId);
      expect(repo.findActiveChildrenByParentId).toHaveBeenCalledWith("p1");
    });
  });
});