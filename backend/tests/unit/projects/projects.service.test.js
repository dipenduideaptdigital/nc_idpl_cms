import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as projectService from "../../../src/modules/projects/projects.service.js";
import * as repository from "../../../src/modules/projects/projects.repository.js";
import { prisma } from "../../../src/config/db.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mocking dependencies
vi.mock("../../../src/modules/projects/projects.repository.js");
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    media: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("Project Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createProject()", () => {
    it("TC-1: should generate slug from title if slug is not provided", async () => {
      repository.findBySlug.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: "proj_1", title: "Modern Interior Project", slug: "modern-interior-project" });

      await projectService.createProject({ title: "Modern Interior Project", category: "Interior" });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "modern-interior-project" })
      );
    });

    it("TC-2: should use provided slug instead of generating from title", async () => {
      repository.findBySlug.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: "proj_2" });

      await projectService.createProject({ title: "Some Title", slug: "custom-project-slug", category: "Exterior" });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "custom-project-slug" })
      );
    });

    it("TC-3: should call repository.create exactly once for a normal creation", async () => {
      repository.findBySlug.mockResolvedValue(null);
      await projectService.createProject({ title: "Normal Project", category: "Interior" });
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it("TC-4: should append partial timestamp to slug if it already exists", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00.123Z")); // Mocking Date.now()
      
      // Simulate that the base slug already exists
      repository.findBySlug.mockResolvedValueOnce({ id: "existing_proj" });
      repository.create.mockResolvedValue({ id: "new_proj" });

      await projectService.createProject({ title: "Duplicate Slug", category: "Interior" });

      // "duplicate-slug" + "-" + last 4 digits of timestamp
      const timestampString = Date.now().toString().slice(-4);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: `duplicate-slug-${timestampString}` })
      );
    });

    it("TC-5: should validate an image ID and use it when media exists", async () => {
    repository.findBySlug.mockResolvedValue(null);
    prisma.media.findUnique.mockResolvedValue({ id: "clxxxxxx" });

    await projectService.createProject({
      title: "Img Project",
      category: "Test",
      featuredImageId: "clxxxxxx",
    });

    expect(prisma.media.findUnique).toHaveBeenCalledWith({
      where: { id: "clxxxxxx" },
      select: { id: true },
    });

    expect(prisma.media.findFirst).not.toHaveBeenCalled();

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ featuredImageId: "clxxxxxx" })
    );
  });

    it("TC-6: should resolve media ID from image URL", async () => {
      repository.findBySlug.mockResolvedValue(null);
      prisma.media.findFirst.mockResolvedValueOnce({ id: "resolved-media-id" });

      await projectService.createProject({ title: "URL Project", category: "Test", featuredImageId: "https://example.com/uploads/image.jpg" });

      expect(prisma.media.findFirst).toHaveBeenCalledWith({ where: { url: "https://example.com/uploads/image.jpg" } });
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ featuredImageId: "resolved-media-id" })
      );
    });

    it("TC-7: should fallback to pathname if full HTTP URL is not found", async () => {
      repository.findBySlug.mockResolvedValue(null);
      // First call returns null (full URL not found), second call returns media (pathname found)
      prisma.media.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "resolved-path-id" });

      await projectService.createProject({ title: "URL Fallback", category: "Test", featuredImageId: "https://example.com/uploads/image.jpg" });

      expect(prisma.media.findFirst).toHaveBeenNthCalledWith(1, { where: { url: "https://example.com/uploads/image.jpg" } });
      expect(prisma.media.findFirst).toHaveBeenNthCalledWith(2, { where: { url: "/uploads/image.jpg" } });
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ featuredImageId: "resolved-path-id" })
      );
    });

    it("TC-8: should set image ID to null if unresolvable", async () => {
      repository.findBySlug.mockResolvedValue(null);
      prisma.media.findFirst.mockResolvedValue(null); // Not found in DB

      await projectService.createProject({ title: "Unresolvable Img", category: "Test", featuredImageId: "https://example.com/bad.jpg" });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ featuredImageId: null })
      );
    });

    it("TC-9: should proceed with null if image lookup throws an error", async () => {
      repository.findBySlug.mockResolvedValue(null);
      prisma.media.findFirst.mockRejectedValue(new Error("Database connection lost"));

      await projectService.createProject({ title: "DB Error Img", category: "Test", featuredImageId: "https://example.com/error.jpg" });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ featuredImageId: null })
      );
    });
  });

  describe("getProjects()", () => {
    it("TC-10: should calculate skip and take correctly for pagination", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 25 });
      await projectService.getProjects({ page: 3, limit: 10 });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      );
    });

    it("TC-11: should apply status filter correctly", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, status: "PUBLISHED" });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: "PUBLISHED" }) })
      );
    });

    it("TC-12: should apply category filter", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, category: "Residential" });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ category: "Residential" }) })
      );
    });

    it("TC-13: should ignore category filter if category is 'All'", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, category: "All" });

      const callArgs = repository.findAll.mock.calls[0][0];
      expect(callArgs.where.category).toBeUndefined();
    });

    it("TC-14: should apply search query across multiple fields", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, search: "villa" });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: "villa" } },
              { location: { contains: "villa" } },
              { category: { contains: "villa" } }
            ]
          })
        })
      );
    });

    it("TC-15: should combine status, category, and search filters together", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, status: "DRAFT", category: "Commercial", search: "office" });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: "DRAFT",
            category: "Commercial",
            OR: [
              { title: { contains: "office" } },
              { location: { contains: "office" } },
              { category: { contains: "office" } }
            ]
          }
        })
      );
    });

    it("TC-16: should map sortBy and sortOrder correctly", async () => {
      repository.findAll.mockResolvedValue({ projects: [], total: 0 });
      await projectService.getProjects({ page: 1, limit: 10, sortBy: "title", sortOrder: "asc" });

      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { title: "asc" } })
      );
    });

    it("TC-17: should return business response contract for pagination", async () => {
      const mockProjects = [{ id: "proj_1" }, { id: "proj_2" }];
      repository.findAll.mockResolvedValue({ projects: mockProjects, total: 25 });

      const result = await projectService.getProjects({ page: 2, limit: 10 });

      expect(result).toEqual({
        projects: mockProjects,
        pagination: { page: 2, limit: 10, total: 25, totalPages: 3 }
      });
    });
  });

  describe("getProjectById() & getProjectBySlug()", () => {
    it("TC-18 & TC-20: should return project if exists", async () => {
      const mockProject = { id: "proj_1", title: "Test" };
      repository.findById.mockResolvedValue(mockProject);
      repository.findBySlug.mockResolvedValue(mockProject);

      const byId = await projectService.getProjectById("proj_1");
      const bySlug = await projectService.getProjectBySlug("test");

      expect(byId).toEqual(mockProject);
      expect(bySlug).toEqual(mockProject);
    });

    it("TC-19 & TC-21: should throw 404 AppError if project does not exist", async () => {
      repository.findById.mockResolvedValue(null);
      repository.findBySlug.mockResolvedValue(null);

      await expect(projectService.getProjectById("invalid_id")).rejects.toThrow(AppError);
      await expect(projectService.getProjectBySlug("invalid-slug")).rejects.toThrow(AppError);
    });
  });

  describe("updateProject()", () => {
    it("TC-22: should throw 404 and not update if project does not exist", async () => {
      repository.findById.mockResolvedValue(null);
      await expect(projectService.updateProject("non-existent-id", { title: "New" })).rejects.toThrow(AppError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it("TC-23: should update without checking slug uniqueness if slug is not provided", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1", slug: "old-slug" });
      repository.update.mockResolvedValue({ id: "proj_1", title: "Updated Title" });

      await projectService.updateProject("proj_1", { title: "Updated Title" });

      expect(repository.findBySlug).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith("proj_1", expect.objectContaining({ title: "Updated Title" }));
    });

    it("TC-24: should normalize provided slug before checking and updating", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1" });
      repository.findBySlug.mockResolvedValue(null); // No conflict

      await projectService.updateProject("proj_1", { slug: "My New Project" });

      expect(repository.findBySlug).toHaveBeenCalledWith("my-new-project");
      expect(repository.update).toHaveBeenCalledWith("proj_1", expect.objectContaining({ slug: "my-new-project" }));
    });

    it("TC-25: should throw 400 AppError if slug is already in use by ANOTHER project", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1" });
      repository.findBySlug.mockResolvedValue({ id: "another_proj_id" }); // Conflict!

      await expect(projectService.updateProject("proj_1", { slug: "conflicting-slug" })).rejects.toThrow(AppError);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it("TC-26: should proceed with update if duplicate slug belongs to the SAME project", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1" });
      repository.findBySlug.mockResolvedValue({ id: "proj_1" }); // Same project, no conflict

      await projectService.updateProject("proj_1", { slug: "same-slug" });

      expect(repository.update).toHaveBeenCalledWith("proj_1", expect.objectContaining({ slug: "same-slug" }));
    });

    it("TC-27: should resolve image logic during update", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1" });
      repository.findBySlug.mockResolvedValue(null);
      prisma.media.findFirst.mockResolvedValueOnce({ id: "resolved-hero-id" });

      await projectService.updateProject("proj_1", { heroImageId: "https://example.com/hero.jpg" });

      expect(prisma.media.findFirst).toHaveBeenCalledWith({ where: { url: "https://example.com/hero.jpg" } });
      expect(repository.update).toHaveBeenCalledWith("proj_1", expect.objectContaining({ heroImageId: "resolved-hero-id" }));
    });
  });

  describe("deleteProject()", () => {
    it("TC-28: should delete project successfully if it exists", async () => {
      repository.findById.mockResolvedValue({ id: "proj_1" });
      repository.deleteById.mockResolvedValue({ message: "Deleted" });

      await projectService.deleteProject("proj_1");

      expect(repository.deleteById).toHaveBeenCalledWith("proj_1");
    });

    it("TC-29: should throw 404 AppError and not delete if project does not exist", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(projectService.deleteProject("invalid_id")).rejects.toThrow(AppError);
      expect(repository.deleteById).not.toHaveBeenCalled();
    });
  });
});