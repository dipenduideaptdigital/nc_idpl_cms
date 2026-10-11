import { describe, it, expect } from "vitest";
import { serializePage } from "../../../src/shared/utils/serializePage.js";

describe("serializePage()", () => {
  // Comprehensive mock page with both public, admin, relational, and internal dummy fields
  const mockPage = {
    id: "page_123",
    title: "About Us",
    slug: "about",
    fullPath: "/about",
    excerpt: "About our company",
    content: { blocks: [] },
    status: "PUBLISHED",
    template: "default",
    templateKey: "default-key",
    templateVersion: 1,
    metaTitle: "About - NC",
    metaDescription: "Learn more",
    metaKeywords: "about, us",
    includeInSitemap: true,
    noIndex: false,
    noFollow: false,
    canonicalUrl: "https://example.com/about",
    ogTitle: "About Us",
    ogDescription: "Learn more about us",
    publishedAt: new Date("2026-01-01T10:00:00Z"),
    scheduledUpdateAt: null,
    createdAt: new Date("2026-01-01T09:00:00Z"),
    updatedAt: new Date("2026-01-02T10:00:00Z"),
    
    // Admin-only fields
    parentId: "parent_456",
    menuOrder: 1,
    showInMenu: true,
    authorId: "author_789",
    updatedById: "author_789",
    deletedAt: null,
    ogImageId: "og_123",

    // Relations with extra data that shouldn't leak
    author: {
      id: "author_789",
      name: "Dipendu",
      email: "dipendu@example.com",
      internalSecretField: "secret", 
    },
    featuredImage: {
      id: "img_001",
      url: "https://example.com/image.jpg",
      thumbnailUrl: "https://example.com/thumb.jpg",
      mimeType: "image/jpeg", 
    },
    ogImage: {
      id: "og_123",
      url: "https://example.com/og.jpg",
      thumbnailUrl: "https://example.com/og-thumb.jpg",
      size: 1024, 
    },

    // Completely unexpected internal prop
    extraInternalProp: "should-not-leak",
  };

  it("should return null for a missing page", () => {
    // 1. Guard clause test
    expect(serializePage(null)).toBeNull();
    expect(serializePage(undefined)).toBeNull();
  });

  describe("public context", () => {
    it("should serialize the base page fields without internal props", () => {
      // 2. Base fields serialization
      const result = serializePage(mockPage, "public");
      
      expect(result.id).toBe(mockPage.id);
      expect(result.title).toBe(mockPage.title);
      expect(result.slug).toBe(mockPage.slug);
      expect(result.fullPath).toBe(mockPage.fullPath);
      expect(result.extraInternalProp).toBeUndefined();
    });

    it("should exclude admin-only fields", () => {
      // 3. Admin-only fields MUST NOT leak in public
      const result = serializePage(mockPage, "public");

      expect(result.parentId).toBeUndefined();
      expect(result.menuOrder).toBeUndefined();
      expect(result.showInMenu).toBeUndefined();
      expect(result.authorId).toBeUndefined();
      expect(result.updatedById).toBeUndefined();
      expect(result.deletedAt).toBeUndefined();
      expect(result.ogImageId).toBeUndefined();
    });

    it("should expose only the public relation fields", () => {
      // 4. Secure relation shapes for public
      const result = serializePage(mockPage, "public");

      expect(result.author).toEqual({ name: "Dipendu" });
      expect(result.featuredImage).toEqual({
        url: "https://example.com/image.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
      });
      expect(result.ogImage).toEqual({
        url: "https://example.com/og.jpg",
        thumbnailUrl: "https://example.com/og-thumb.jpg",
      });
    });
  });

  describe("admin context", () => {
    it("should be the default context", () => {
      // 5. Default parameter behavior
      const explicitAdminResult = serializePage(mockPage, "admin");
      const defaultResult = serializePage(mockPage);

      expect(defaultResult).toEqual(explicitAdminResult);
    });

    it("should include admin-only fields", () => {
      // 6. Admin fields exist
      const result = serializePage(mockPage, "admin");

      expect(result.parentId).toBe(mockPage.parentId);
      expect(result.menuOrder).toBe(mockPage.menuOrder);
      expect(result.authorId).toBe(mockPage.authorId);
    });

    it("should include expanded relation fields", () => {
      // 7. Expanded relations but still sanitized from absolute internal fields
      const result = serializePage(mockPage, "admin");

      expect(result.author).toEqual({
        id: "author_789",
        name: "Dipendu",
        email: "dipendu@example.com",
      }); // internalSecretField is omitted

      expect(result.featuredImage).toEqual({
        id: "img_001",
        url: "https://example.com/image.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
      }); // mimeType is omitted
    });
  });

  it("should serialize missing relations as null", () => {
    // 8. Graceful handling of missing relationships
    const pageWithoutRelations = {
      ...mockPage,
      author: null,
      featuredImage: null,
      ogImage: null,
    };

    const publicResult = serializePage(pageWithoutRelations, "public");
    expect(publicResult.author).toBeNull();
    expect(publicResult.featuredImage).toBeNull();
    expect(publicResult.ogImage).toBeNull();

    const adminResult = serializePage(pageWithoutRelations, "admin");
    expect(adminResult.author).toBeNull();
    expect(adminResult.featuredImage).toBeNull();
    expect(adminResult.ogImage).toBeNull();
  });
});