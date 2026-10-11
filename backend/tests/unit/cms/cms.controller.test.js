import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import * as cmsController from "../../../src/modules/cms/cms.controller.js";
import * as cmsService from "../../../src/modules/cms/cms.service.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/cms/cms.service.js");

vi.mock("../../../src/shared/utils/asyncHandler.js", () => ({
  asyncHandler: vi.fn((fn) => fn),
}));

describe("CMS Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    
    req = {
      params: {},
      body: {},
      query: {},
      user: {},
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  // getDynamicSectionController
  describe("getDynamicSectionController", () => {
    it("CC-01: should return 200 and service data for a registered key", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      const mockData = { content: { heading: "Hero" } };
      cmsService.getHomepageSection.mockResolvedValue(mockData);

      await cmsController.getDynamicSectionController(req, res);

      expect(cmsService.getHomepageSection).toHaveBeenCalledWith("nc_homepage_hero");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Fetched nc_homepage_hero successfully",
          data: mockData,
        })
      );
    });

    it("CC-02: should throw 404 AppError for an unknown key without calling service", async () => {
      req.params.sectionKey = "invalid_section";

      await expect(cmsController.getDynamicSectionController(req, res)).rejects.toThrow(AppError);
      await expect(cmsController.getDynamicSectionController(req, res)).rejects.toMatchObject({
        statusCode: StatusCodes.NOT_FOUND,
        message: "CMS section not found",
      });
      expect(cmsService.getHomepageSection).not.toHaveBeenCalled();
    });

    it("CC-03: should return default { content: {} } if service returns it for a missing section", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      cmsService.getHomepageSection.mockResolvedValue({ content: {} });

      await cmsController.getDynamicSectionController(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: { content: {} } })
      );
    });

    it("CC-04: should propagate service database/rejection errors", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      cmsService.getHomepageSection.mockRejectedValue(new Error("DB Error"));

      await expect(cmsController.getDynamicSectionController(req, res)).rejects.toThrow("DB Error");
    });

    it("CC-05: should reject prototype properties like 'toString' as unregistered sections", async () => {
      req.params.sectionKey = "toString";

      await expect(cmsController.getDynamicSectionController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getHomepageSection).not.toHaveBeenCalled();
    });
  });

  // updateDynamicSectionController
  describe("updateDynamicSectionController", () => {
    it("CC-06 & CC-07: should pass correct args to service and return 200 with updated data", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      req.body = { content: { title: "Updated" } };
      req.user = { id: "admin_user_123" };
      
      const mockResult = { content: { title: "Updated" } };
      cmsService.updateHomepageSection.mockResolvedValue(mockResult);

      await cmsController.updateDynamicSectionController(req, res);

      expect(cmsService.updateHomepageSection).toHaveBeenCalledWith(
        "nc_homepage_hero",
        { content: req.body.content },
        "admin_user_123"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockResult })
      );
    });

    it("CC-08: should propagate service errors during update", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      req.body = { content: {} };
      cmsService.updateHomepageSection.mockRejectedValue(new Error("Update failed"));

      await expect(cmsController.updateDynamicSectionController(req, res)).rejects.toThrow("Update failed");
    });

    it("CC-09: should pass nested fields in content without mutating structure", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      req.body = { content: { features: [{ id: 1 }, { id: 2 }] } };
      cmsService.updateHomepageSection.mockResolvedValue(req.body);

      await cmsController.updateDynamicSectionController(req, res);

      expect(cmsService.updateHomepageSection).toHaveBeenCalledWith(
        "nc_homepage_hero",
        { content: { features: [{ id: 1 }, { id: 2 }] } },
        undefined // undefined actorId if req.user is missing
      );
    });

    it("CC-10: should safely pass undefined as actorId if req.user is missing", async () => {
      req.params.sectionKey = "nc_homepage_hero";
      req.body = { content: {} };
      delete req.user; // Ensure no user object exists

      cmsService.updateHomepageSection.mockResolvedValue({});
      
      await cmsController.updateDynamicSectionController(req, res);
      
      expect(cmsService.updateHomepageSection).toHaveBeenCalledWith(
        "nc_homepage_hero",
        { content: {} },
        undefined
      );
    });
  });

  // getMultipleDynamicSectionsController
  describe("getMultipleDynamicSectionsController", () => {
    it("CC-11: should throw 400 AppError if 'keys' query parameter is missing", async () => {
      req.query = {}; // missing keys

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getMultipleHomepageSections).not.toHaveBeenCalled();
    });

    it("CC-12: should throw 400 AppError if 'keys' is an empty string", async () => {
      req.query.keys = "   "; // empty/whitespace

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getMultipleHomepageSections).not.toHaveBeenCalled();
    });

    it("CC-13 & CC-14: should trim keys, call service, and return 200", async () => {
      req.query.keys = " nc_homepage_hero , homepage_footer ";
      const mockResult = {
        nc_homepage_hero: { content: {} },
        homepage_footer: { content: {} },
      };
      cmsService.getMultipleHomepageSections.mockResolvedValue(mockResult);

      await cmsController.getMultipleDynamicSectionsController(req, res);

      expect(cmsService.getMultipleHomepageSections).toHaveBeenCalledWith(["nc_homepage_hero", "homepage_footer"]);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Fetched multiple CMS sections successfully",
          data: mockResult,
        })
      );
    });

    it("CC-15: should propagate service errors", async () => {
      req.query.keys = "nc_homepage_hero";
      cmsService.getMultipleHomepageSections.mockRejectedValue(new Error("Multi fetch error"));

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow("Multi fetch error");
    });


    it("CC-16: should reject malformed input containing empty entries (e.g., 'hero,,blogs')", async () => {
      req.query.keys = "nc_homepage_hero,,homepage_footer";

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getMultipleHomepageSections).not.toHaveBeenCalled();
    });

    it("CC-17: should gracefully reject if 'keys' occurs multiple times in query as an array", async () => {
      req.query.keys = ["nc_homepage_hero", "homepage_footer"]; // Express converts duplicate query params to an array

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getMultipleHomepageSections).not.toHaveBeenCalled();
    });

    it("CC-18: should reject entirely if ANY key in the requested list is unregistered", async () => {
      req.query.keys = "nc_homepage_hero,unregistered_malicious_key";

      await expect(cmsController.getMultipleDynamicSectionsController(req, res)).rejects.toThrow(AppError);
      expect(cmsService.getMultipleHomepageSections).not.toHaveBeenCalled();
    });
  });
});