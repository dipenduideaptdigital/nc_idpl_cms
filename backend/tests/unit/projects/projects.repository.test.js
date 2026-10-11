
import { describe, it, expect, vi, beforeEach } from "vitest";

import { prisma } from "../../../src/config/db.js";

import {
  create,
  findAll,
  findById,
  findBySlug,
  update,
  deleteById,
} from "../../../src/modules/projects/projects.repository.js";

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Projects Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create()", () => {
    it("should create a project using the supplied data", async () => {
      const data = {
        title: "Modern Interior",
        slug: "modern-interior",
        category: "Interior",
      };

      const createdProject = {
        id: "project-1",
        ...data,
      };

      prisma.project.create.mockResolvedValue(createdProject);

      const result = await create(data);

      expect(prisma.project.create).toHaveBeenCalledTimes(1);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data,
      });
      expect(result).toEqual(createdProject);
    });

    it("should propagate a Prisma creation error", async () => {
      const databaseError = new Error("Database write failed");

      prisma.project.create.mockRejectedValue(databaseError);

      await expect(
        create({ title: "Modern Interior" })
      ).rejects.toBe(databaseError);
    });
  });

  describe("findAll()", () => {
    it("should fetch projects and count using the same filters", async () => {
      const options = {
        skip: 10,
        take: 10,
        where: {
          status: "PUBLISHED",
          category: "Interior",
        },
        orderBy: {
          title: "asc",
        },
      };

      const projects = [
        { id: "project-1", title: "Interior A" },
        { id: "project-2", title: "Interior B" },
      ];

      prisma.project.findMany.mockResolvedValue(projects);
      prisma.project.count.mockResolvedValue(25);

      const result = await findAll(options);

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        where: options.where,
        orderBy: options.orderBy,
        include: {
          featuredImage: true,
          heroImage: true,
        },
      });

      expect(prisma.project.count).toHaveBeenCalledWith({
        where: options.where,
      });

      expect(result).toEqual({
        projects,
        total: 25,
      });
    });

    it("should preserve empty filters when no filters are supplied", async () => {
      prisma.project.findMany.mockResolvedValue([]);
      prisma.project.count.mockResolvedValue(0);

      const options = {
        skip: 0,
        take: 10,
        where: {},
        orderBy: { title: "desc" },
      };

      const result = await findAll(options);

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        ...options,
        include: {
          featuredImage: true,
          heroImage: true,
        },
      });

      expect(prisma.project.count).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual({
        projects: [],
        total: 0,
      });
    });

    it("should reject if either database query fails", async () => {
      const databaseError = new Error("Project count failed");

      prisma.project.findMany.mockResolvedValue([]);
      prisma.project.count.mockRejectedValue(databaseError);

      await expect(
        findAll({
          skip: 0,
          take: 10,
          where: {},
          orderBy: { title: "asc" },
        })
      ).rejects.toBe(databaseError);
    });
  });

  describe("findById()", () => {
    it("should find a project by ID and include its image relations", async () => {
      const project = {
        id: "project-1",
        title: "Modern Interior",
      };

      prisma.project.findUnique.mockResolvedValue(project);

      const result = await findById("project-1");

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        include: {
          featuredImage: true,
          heroImage: true,
        },
      });

      expect(result).toEqual(project);
    });

    it("should return null when the project does not exist", async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      const result = await findById("missing-project");

      expect(result).toBeNull();
    });
  });

  describe("findBySlug()", () => {
    it("should find a project by slug and include its image relations", async () => {
      const project = {
        id: "project-1",
        slug: "modern-interior",
      };

      prisma.project.findUnique.mockResolvedValue(project);

      const result = await findBySlug("modern-interior");

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          slug: "modern-interior",
        },
        include: {
          featuredImage: true,
          heroImage: true,
        },
      });

      expect(result).toEqual(project);
    });

    it("should return null when the slug does not exist", async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      const result = await findBySlug("missing-slug");

      expect(result).toBeNull();
    });
  });

  describe("update()", () => {
    it("should update the specified project with the supplied data", async () => {
      const data = {
        title: "Updated Interior",
        category: "Residential",
      };

      const updatedProject = {
        id: "project-1",
        ...data,
      };

      prisma.project.update.mockResolvedValue(updatedProject);

      const result = await update("project-1", data);

      expect(prisma.project.update).toHaveBeenCalledTimes(1);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data,
      });

      expect(result).toEqual(updatedProject);
    });

    it("should propagate a Prisma update error", async () => {
      const databaseError = new Error("Project update failed");

      prisma.project.update.mockRejectedValue(databaseError);

      await expect(
        update("project-1", { title: "Updated Interior" })
      ).rejects.toBe(databaseError);
    });
  });

  describe("deleteById()", () => {
    it("should delete the specified project", async () => {
      const deletedProject = {
        id: "project-1",
        title: "Modern Interior",
      };

      prisma.project.delete.mockResolvedValue(deletedProject);

      const result = await deleteById("project-1");

      expect(prisma.project.delete).toHaveBeenCalledTimes(1);
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
      });

      expect(result).toEqual(deletedProject);
    });

    it("should propagate a Prisma deletion error", async () => {
      const databaseError = new Error("Project deletion failed");

      prisma.project.delete.mockRejectedValue(databaseError);

      await expect(
        deleteById("project-1")
      ).rejects.toBe(databaseError);
    });
  });
});
