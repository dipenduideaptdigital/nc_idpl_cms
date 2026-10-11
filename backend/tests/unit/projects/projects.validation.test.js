import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  projectIdParamSchema,
  projectSlugParamSchema,
} from "../../../src/modules/projects/projects.validation.js";

describe("Projects Validation Schemas", () => {
  const validBasePayload = {
    title: "Modern Villa",
    category: "Residential",
  };

  describe("1. createProjectSchema", () => {
    it("PVAL-01: should accept minimum valid payload (title and category)", () => {
      const result = createProjectSchema.safeParse(validBasePayload);
      expect(result.success).toBe(true);
      expect(result.data.status).toBe("PUBLISHED"); // Default applied
    });

    it("PVAL-02: should reject if required fields are missing", () => {
      expect(createProjectSchema.safeParse({ category: "Res" }).success).toBe(false);
      expect(createProjectSchema.safeParse({ title: "Villa" }).success).toBe(false);
    });

    it("PVAL-03: should validate title boundary limits", () => {
      expect(createProjectSchema.safeParse({ ...validBasePayload, title: "a".repeat(150) }).success).toBe(true);
      expect(createProjectSchema.safeParse({ ...validBasePayload, title: "a".repeat(151) }).success).toBe(false);
      expect(createProjectSchema.safeParse({ ...validBasePayload, title: "" }).success).toBe(false); // min 1
    });

    it("PVAL-04: should normalize and validate slug patterns", () => {
      // Lowercase conversion test
      const res1 = createProjectSchema.safeParse({ ...validBasePayload, slug: "  My-Slug-123  " });
      expect(res1.success).toBe(true);
      expect(res1.data.slug).toBe("my-slug-123");

      // Invalid slug pattern
      const res2 = createProjectSchema.safeParse({ ...validBasePayload, slug: "invalid_slug!" });
      expect(res2.success).toBe(false);
      expect(res2.error.issues[0].message).toContain("Slug can only contain lowercase letters, numbers, and dashes");
    });

    it("PVAL-05: should validate optional/nullable fields correctly", () => {
      const fullPayload = {
        ...validBasePayload,
        year: "2026",
        location: "Kolkata",
        description: null, // nullable testing
        details: "Some details",
        subtitle: "A modern home",
        specifications: "Specs",
        galleryImages: ["img1.jpg", "img2.jpg"],
        metaTitle: "a".repeat(100),
      };
      const result = createProjectSchema.safeParse(fullPayload);
      expect(result.success).toBe(true);
    });

    it("PVAL-06: should validate meta text limits", () => {
      expect(createProjectSchema.safeParse({ ...validBasePayload, metaTitle: "a".repeat(101) }).success).toBe(false);
      expect(createProjectSchema.safeParse({ ...validBasePayload, metaDescription: "a".repeat(501) }).success).toBe(false);
    });

    it("PVAL-07: should transform empty image IDs to null", () => {
      const result = createProjectSchema.safeParse({
        ...validBasePayload,
        featuredImageId: "",
        heroImageId: "",
      });
      expect(result.success).toBe(true);
      expect(result.data.featuredImageId).toBeNull();
      expect(result.data.heroImageId).toBeNull();
    });

    it("PVAL-08: should enforce minimum length 5 for non-empty image IDs", () => {
      const resultInvalid = createProjectSchema.safeParse({
        ...validBasePayload,
        featuredImageId: "1234", // Length 4
      });
      expect(resultInvalid.success).toBe(false);

      const resultValid = createProjectSchema.safeParse({
        ...validBasePayload,
        featuredImageId: "12345", // Length 5
      });
      expect(resultValid.success).toBe(true);
    });

    it("PVAL-09: should reject unknown fields due to strict mode", () => {
      const result = createProjectSchema.safeParse({
        ...validBasePayload,
        maliciousField: "hack",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("2. updateProjectSchema", () => {
    it("PVAL-10: should allow empty object or partial updates", () => {
      expect(updateProjectSchema.safeParse({}).success).toBe(true);
      expect(updateProjectSchema.safeParse({ title: "Updated Villa" }).success).toBe(true);
      expect(updateProjectSchema.safeParse({ status: "ARCHIVED" }).success).toBe(true);
    });

    it("PVAL-11: should still enforce boundaries on partial updates", () => {
      expect(updateProjectSchema.safeParse({ title: "a".repeat(151) }).success).toBe(false);
      expect(updateProjectSchema.safeParse({ featuredImageId: "1234" }).success).toBe(false);
    });
  });

  describe("3. projectQuerySchema", () => {
    it("PVAL-12: should apply default values for missing queries", () => {
      const result = projectQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    });

    it("PVAL-13: should coerce string values to numbers", () => {
      const result = projectQuerySchema.safeParse({ page: "3", limit: "50" });
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    });

    it("PVAL-14: should enforce page and limit boundaries", () => {
      expect(projectQuerySchema.safeParse({ page: 0 }).success).toBe(false);
      expect(projectQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
      expect(projectQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
    });

    it("PVAL-15: should reject invalid enum values", () => {
      expect(projectQuerySchema.safeParse({ status: "DELETED" }).success).toBe(false);
      expect(projectQuerySchema.safeParse({ sortBy: "unknownField" }).success).toBe(false);
      expect(projectQuerySchema.safeParse({ sortOrder: "random" }).success).toBe(false);
    });
  });

  describe("4. URL Parameters Schemas", () => {
    it("PVAL-16: should validate projectIdParamSchema (min length 5)", () => {
      expect(projectIdParamSchema.safeParse({ id: "12345" }).success).toBe(true);
      expect(projectIdParamSchema.safeParse({ id: "1234" }).success).toBe(false);
    });

    it("PVAL-17: should validate projectSlugParamSchema (min length 1)", () => {
      expect(projectSlugParamSchema.safeParse({ slug: "modern-villa" }).success).toBe(true);
      expect(projectSlugParamSchema.safeParse({ slug: "" }).success).toBe(false);
    });
  });
});