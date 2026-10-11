import { describe, it, expect, vi, beforeEach } from "vitest";
import * as pagesController from "../../../src/modules/pages/pages.controller.js";
import * as pagesService from "../../../src/modules/pages/pages.service.js";
import * as pagesRepo from "../../../src/modules/pages/pages.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { StatusCodes } from "http-status-codes";

vi.mock("../../../src/modules/pages/pages.service.js");
vi.mock("../../../src/modules/pages/pages.repository.js");
vi.mock("../../../src/shared/utils/serializePage.js", () => ({
  serializePage: vi.fn((page, context) => ({ ...page, _serialized: true, context }))
}));

describe("Pages Controller", () => {
  let req, res, next;
  const actorId = "admin-123";

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      body: {},
      params: {},
      query: {},
      user: { id: actorId },
      path: "",
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  describe("Admin Controllers", () => {
    describe("createPageController()", () => {
      it("PC01, PC02: should call service and return 201 CREATED with page data", async () => {
        req.body = { title: "New Page" };
        const mockCreatedPage = { id: "p1", title: "New Page" };
        pagesService.createNewPage.mockResolvedValue(mockCreatedPage);

        await pagesController.createPageController(req, res, next);

        expect(pagesService.createNewPage).toHaveBeenCalledWith(req.body, actorId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ success: true, data: mockCreatedPage })
        );
      });

      it("PC03: should pass service errors to next()", async () => {
        const error = new Error("Service Error");
        pagesService.createNewPage.mockRejectedValue(error);

        await pagesController.createPageController(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
      });
    });

    describe("getAdminPagesListController()", () => {
      it("PC04, PC05: should pass query to service and return 200 with data and meta", async () => {
        req.query = { page: 2, limit: 10 };
        const mockResult = { data: [{ id: "p1" }], meta: { total: 1 } };
        pagesService.getPagesList.mockResolvedValue(mockResult);

        await pagesController.getAdminPagesListController(req, res, next);

        expect(pagesService.getPagesList).toHaveBeenCalledWith(req.query);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            data: mockResult.data,
            meta: mockResult.meta,
          })
        );
      });
    });

    describe("getAdminPageTreeController()", () => {
      it("PC07, PC08: should return 200 with tree data", async () => {
        const mockTree = [{ id: "p1", children: [] }];
        pagesService.getAdminPageTree.mockResolvedValue(mockTree);

        await pagesController.getAdminPageTreeController(req, res, next);

        expect(pagesService.getAdminPageTree).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockTree }));
      });
    });

    describe("getAdminPageByIdController()", () => {
      it("PC09, PC10: should query repository directly, serialize, and return 200", async () => {
        req.params.id = "p1";
        const mockPage = { id: "p1", title: "Raw Page" };
        pagesRepo.findPageById.mockResolvedValue(mockPage);

        await pagesController.getAdminPageByIdController(req, res, next);

        expect(pagesRepo.findPageById).toHaveBeenCalledWith("p1");
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ id: "p1", _serialized: true, context: "admin" }),
          })
        );
      });

      it("PC11: should pass 404 AppError to next() if page not found", async () => {
        req.params.id = "bad-id";
        pagesRepo.findPageById.mockResolvedValue(null);

        await pagesController.getAdminPageByIdController(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: StatusCodes.NOT_FOUND }));
      });
    });

    describe("updatePageController()", () => {
      it("PC12, PC13: should update page via service and return 200 OK", async () => {
        req.params.id = "p1";
        req.body = { title: "Updated" };
        const mockUpdated = { id: "p1", title: "Updated" };
        pagesService.updateExistingPage.mockResolvedValue(mockUpdated);

        await pagesController.updatePageController(req, res, next);

        expect(pagesService.updateExistingPage).toHaveBeenCalledWith("p1", req.body, actorId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockUpdated }));
      });
    });

    describe("duplicatePageController()", () => {
      it("PC15, PC16: should duplicate page via service and return 201", async () => {
        req.params.id = "p1";
        const mockDuplicate = { id: "p2", title: "Copy" };
        pagesService.duplicatePage.mockResolvedValue(mockDuplicate);

        await pagesController.duplicatePageController(req, res, next);

        expect(pagesService.duplicatePage).toHaveBeenCalledWith("p1", actorId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockDuplicate }));
      });
    });

    describe("deletePageController()", () => {
      it("PC18, PC19, PC20: should delete page and return 200 with null data", async () => {
        req.params.id = "p1";
        pagesService.deletePage.mockResolvedValue();

        await pagesController.deletePageController(req, res, next);

        expect(pagesService.deletePage).toHaveBeenCalledWith("p1", actorId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ success: true, message: expect.any(String), data: null })
        );
      });
    });

    describe("Revision Controllers", () => {
      it("should return revisions list 200 OK", async () => {
        req.params.id = "p1";
        pagesService.getPageRevisionsList.mockResolvedValue([]);
        await pagesController.getPageRevisionsController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      });

      it("should return single revision snapshot 200 OK", async () => {
        req.params = { id: "p1", revisionId: "r1" };
        pagesService.getSinglePageRevision.mockResolvedValue({});
        await pagesController.getSingleRevisionSnapshotController(req, res, next);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      });

      it("should restore revision and return 200 OK with restored page", async () => {
        req.params = { id: "p1", revisionId: "r1" };
        pagesService.restorePageToRevision.mockResolvedValue({ id: "p1", restored: true });
        await pagesController.restoreRevisionSnapshotController(req, res, next);
        
        expect(pagesService.restorePageToRevision).toHaveBeenCalledWith("p1", "r1", actorId);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      });
    });
  });

  describe("Public Controllers", () => {
    describe("getPublicPagesFlatCollectionController()", () => {
      it("PC22: MUST override query status to PUBLISHED to prevent draft exposure", async () => {
        req.query = { page: 1, limit: 10, status: "DRAFT", search: "secret" };
        pagesService.getPagesList.mockResolvedValue({ data: [], meta: {} });

        await pagesController.getPublicPagesFlatCollectionController(req, res, next);

        expect(pagesService.getPagesList).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          status: "PUBLISHED",
          search: "secret"
        });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      });
    });

    describe("getPublicMenuTreeController()", () => {
      it("PC24: should return public menu tree 200 OK", async () => {
        pagesService.getPublicMenuTree.mockResolvedValue([]);
        await pagesController.getPublicMenuTreeController(req, res, next);
        expect(pagesService.getPublicMenuTree).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      });
    });

    describe("getPublicPageController()", () => {
      it("PC27, PC28: should prepend slash if missing and return page 200 OK", async () => {
        req.path = "about/us";
        pagesService.getPublicPageByPath.mockResolvedValue({ id: "p1" });

        await pagesController.getPublicPageController(req, res, next);

        expect(pagesService.getPublicPageByPath).toHaveBeenCalledWith("/about/us");
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { id: "p1" } }));
      });

      it("PC29: should return 301 Redirect if page not found but old path exists (PUBLISHED & active)", async () => {
        req.path = "/old-about";
        
        const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
        pagesService.getPublicPageByPath.mockRejectedValue(notFoundError);

        pagesRepo.findPageIdByOldPath.mockResolvedValue({
          page: { status: "PUBLISHED", deletedAt: null, fullPath: "/new-about" }
        });

        await pagesController.getPublicPageController(req, res, next);

        expect(pagesRepo.findPageIdByOldPath).toHaveBeenCalledWith("/old-about");
        expect(res.status).toHaveBeenCalledWith(301);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Content has moved permanently.",
            data: { redirect: true, newPath: "/new-about", newUrl: "/new-about" }
          })
        );
        expect(next).not.toHaveBeenCalled();
      });

      it("PC30: should forward original 404 if old path is also not found", async () => {
        req.path = "/fake";
        const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
        pagesService.getPublicPageByPath.mockRejectedValue(notFoundError);
        pagesRepo.findPageIdByOldPath.mockResolvedValue(null);

        await pagesController.getPublicPageController(req, res, next);

        expect(next).toHaveBeenCalledWith(notFoundError);
        expect(res.status).not.toHaveBeenCalled();
      });

      it("PC31: should forward original 404 if old path exists but page is DRAFT or deleted", async () => {
        req.path = "/old-draft";
        const notFoundError = new AppError("Not Found", StatusCodes.NOT_FOUND);
        pagesService.getPublicPageByPath.mockRejectedValue(notFoundError);
        
        pagesRepo.findPageIdByOldPath.mockResolvedValue({
          page: { status: "DRAFT", deletedAt: null, fullPath: "/new-draft" }
        });

        await pagesController.getPublicPageController(req, res, next);

        expect(next).toHaveBeenCalledWith(notFoundError);
        expect(res.status).not.toHaveBeenCalled();
      });

      it("PC32: should forward non-404 errors without attempting redirect lookup", async () => {
        req.path = "/error";
        const dbError = new AppError("DB Connection Error", StatusCodes.INTERNAL_SERVER_ERROR);
        pagesService.getPublicPageByPath.mockRejectedValue(dbError);

        await pagesController.getPublicPageController(req, res, next);

        expect(pagesRepo.findPageIdByOldPath).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(dbError);
      });
    });
  });
});