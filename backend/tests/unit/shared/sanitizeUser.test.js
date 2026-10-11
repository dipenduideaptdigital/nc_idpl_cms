import { describe, it, expect } from "vitest";
import { sanitizeUser } from "../../../src/shared/utils/sanitizeUser.js";

describe("sanitizeUser()", () => {
  it("should return null when user is missing", () => {
    // Null user -> null
    expect(sanitizeUser(null)).toBeNull();
    expect(sanitizeUser(undefined)).toBeNull();
  });

  it("should sanitize basic user fields and exclude internal fields", () => {
    // Basic fields map accurately & passwordHash is excluded
    const mockInput = {
      id: 1,
      name: "Dipendu",
      email: "dipendu@example.com",
      avatar: "avatar.jpg",
      status: "ACTIVE",
      isEmailVerified: true,
      passwordHash: "secret_hash_value",
      createdAt: "2026-10-08T10:00:00Z",
      updatedAt: "2026-10-08T12:00:00Z",
    };

    const expectedOutput = {
      id: 1,
      name: "Dipendu",
      email: "dipendu@example.com",
      avatar: "avatar.jpg",
      status: "ACTIVE",
      isEmailVerified: true,
      systemRole: null, // Default behavior when missing
      functionalRoles: [], // Default behavior when missing
      createdAt: "2026-10-08T10:00:00Z",
      updatedAt: "2026-10-08T12:00:00Z",
    };

    expect(sanitizeUser(mockInput)).toEqual(expectedOutput);
  });

  it("should sanitize systemRole", () => {
    // systemRole properly mapped & extra fields dropped
    const mockInput = {
      id: 2,
      systemRole: {
        id: 10,
        name: "Administrator",
        slug: "ADMIN",
        extraField: "should-not-appear",
      },
    };

    const result = sanitizeUser(mockInput);

    expect(result.systemRole).toEqual({
      id: 10,
      name: "Administrator",
      slug: "ADMIN",
    });
  });

  it("should return null when systemRole is missing", () => {
    // explicit null handling for systemRole
    const mockInput = {
      id: 3,
      systemRole: null,
    };

    const result = sanitizeUser(mockInput);

    expect(result.systemRole).toBeNull();
  });

  it("should sanitize functionalRoles", () => {
    // functionalRoles correctly unwrapped and mapped
    const mockInput = {
      id: 4,
      functionalRoles: [
        {
          functionalRole: {
            id: 1,
            name: "Content Manager",
            slug: "CONTENT_MANAGER",
            secretMeta: "hidden",
          },
        },
        {
          functionalRole: {
            id: 2,
            name: "Editor",
            slug: "EDITOR",
          },
        },
      ],
    };

    const result = sanitizeUser(mockInput);

    expect(result.functionalRoles).toEqual([
      {
        id: 1,
        name: "Content Manager",
        slug: "CONTENT_MANAGER",
      },
      {
        id: 2,
        name: "Editor",
        slug: "EDITOR",
      },
    ]);
  });

  it("should return an empty array when functionalRoles are missing", () => {
    // undefined functionalRoles fallback to []
    const mockInput = {
      id: 5,
      functionalRoles: undefined,
    };

    const result = sanitizeUser(mockInput);

    expect(result.functionalRoles).toEqual([]);
  });
});