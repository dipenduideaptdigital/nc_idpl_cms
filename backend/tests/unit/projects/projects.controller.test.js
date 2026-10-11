import { describe, it, expect, vi, beforeEach } from "vitest";
import * as controller from "../../../src/modules/projects/projects.controller.js";
import * as service from "../../../src/modules/projects/projects.service.js";

// Mock the service layer completely
vi.mock("../../../src/modules/projects/projects.service.js");

describe("Project Controllers", () => {
  let req, res, next;

  // Mocking Express req, res, and next before each test
  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
      query: {},
      params: {},
      user: { id: "user-1" },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe("createProjectController", () => {
    it("TC-1: should call service with req.body and return 201 response", async () => {
      const mockProject = { id: "proj_1", title: "New Project" };
      req.body = { title: "New Project", category: "Interior" };
      service.createProject.mockResolvedValue(mockProject);

      await controller.createProjectController(req, res, next);

      expect(service.createProject).toHaveBeenCalledTimes(1);
      expect(service.createProject).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Project created successfully",
          data: mockProject,
        })
      );
    });

    it("TC-2: should propagate service error to next() (asyncHandler test)", async () => {
      const mockError = new Error("Service Failure");
      service.createProject.mockRejectedValue(mockError);

      await controller.createProjectController(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getAdminProjectsController", () => {
    it("TC-3: should forward req.query correctly to service", async () => {
      req.query = { page: "2", limit: "10", search: "villa" };
      service.getProjects.mockResolvedValue({ projects: [], pagination: {} });

      await controller.getAdminProjectsController(req, res, next);

      expect(service.getProjects).toHaveBeenCalledWith(req.query);
    });

    it("TC-4: should map response data and meta correctly", async () => {
      const mockResult = {
        projects: [{ id: "proj_1" }],
        pagination: { page: 1, limit: 10, total: 1 },
      };
      service.getProjects.mockResolvedValue(mockResult);

      await controller.getAdminProjectsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Projects retrieved successfully",
          data: mockResult.projects,
          meta: mockResult.pagination,
        })
      );
    });
  });

  describe("getAdminProjectByIdController", () => {
    it("TC-5: should call service with ID and return 200 with project data", async () => {
      req.params.id = "proj_123";
      const mockProject = { id: "proj_123", title: "Test" };
      service.getProjectById.mockResolvedValue(mockProject);

      await controller.getAdminProjectByIdController(req, res, next);

      expect(service.getProjectById).toHaveBeenCalledWith("proj_123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockProject })
      );
    });
  });

  describe("updateProjectController", () => {
    it("TC-6: should forward ID and body to service and return updated project", async () => {
      req.params.id = "proj_123";
      req.body = { title: "Updated Title" };
      const updatedProject = { id: "proj_123", title: "Updated Title" };
      service.updateProject.mockResolvedValue(updatedProject);

      await controller.updateProjectController(req, res, next);

      expect(service.updateProject).toHaveBeenCalledWith("proj_123", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Project updated successfully",
          data: updatedProject,
        })
      );
    });
  });

  describe("deleteProjectController", () => {
    it("TC-8: should call service with ID and return 200 without data", async () => {
      req.params.id = "proj_123";
      service.deleteProject.mockResolvedValue();

      await controller.deleteProjectController(req, res, next);

      expect(service.deleteProject).toHaveBeenCalledWith("proj_123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Project deleted successfully" })
      );
    });
  });

  describe("getPublicProjectsController", () => {
    it("TC-9: should forcefully override status to PUBLISHED even if client sends DRAFT", async () => {
      req.query = { page: "1", limit: "10", status: "DRAFT" };
      service.getProjects.mockResolvedValue({ projects: [], pagination: {} });

      await controller.getPublicProjectsController(req, res, next);

      expect(service.getProjects).toHaveBeenCalledWith(
        expect.objectContaining({ status: "PUBLISHED" })
      );
    });

    it("TC-10: should inject status: PUBLISHED if no query is provided", async () => {
      req.query = {};
      service.getProjects.mockResolvedValue({ projects: [], pagination: {} });

      await controller.getPublicProjectsController(req, res, next);

      expect(service.getProjects).toHaveBeenCalledWith({ status: "PUBLISHED" });
    });

    it("TC-11: should correctly map response data and meta for public listing", async () => {
      const mockResult = {
        projects: [{ id: "proj_1" }],
        pagination: { page: 1, limit: 10, total: 1 },
      };
      service.getProjects.mockResolvedValue(mockResult);

      await controller.getPublicProjectsController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockResult.projects,
          meta: mockResult.pagination,
        })
      );
    });
  });

  describe("getPublicProjectBySlugController", () => {
    it("TC-15: should forward slug correctly to service", async () => {
      req.params.slug = "modern-villa";
      service.getProjectBySlug.mockResolvedValue({ status: "PUBLISHED" });

      await controller.getPublicProjectBySlugController(req, res, next);

      expect(service.getProjectBySlug).toHaveBeenCalledWith("modern-villa");
    });

    it("TC-12: should return 200 and project data if status is PUBLISHED", async () => {
      req.params.slug = "modern-villa";
      const mockProject = { id: "proj_1", slug: "modern-villa", status: "PUBLISHED" };
      service.getProjectBySlug.mockResolvedValue(mockProject);

      await controller.getPublicProjectBySlugController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockProject })
      );
    });

    it("TC-13 & TC-14: should return 404 with success: false if project is DRAFT or ARCHIVED", async () => {
      req.params.slug = "draft-villa";
      const mockProject = { id: "proj_1", slug: "draft-villa", status: "DRAFT" };
      service.getProjectBySlug.mockResolvedValue(mockProject);

      await controller.getPublicProjectBySlugController(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Project not found",
        })
      );
      // Ensure data is not leaked
      const jsonArgs = res.json.mock.calls[0][0];
      expect(jsonArgs.data).toBeNull();
    });
  });
});