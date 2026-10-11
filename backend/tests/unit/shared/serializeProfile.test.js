import { describe, it, expect } from "vitest";
import { serializeProfile } from "../../../src/shared/utils/serializeProfile.js";

describe("serializeProfile()", () => {
  const baseUser = {
    id: 1,
    name: "Dipendu",
    email: "dipendu@example.com",
    avatar: "avatar.jpg",
    status: "ACTIVE",
    isEmailVerified: true,
    systemRole: {
      id: 1,
      name: "Admin",
      slug: "ADMIN",
      extraField: "should-pass-through" // systemRole is passed through without sanitization here
    },
    createdAt: "2026-01-01",
    updatedAt: "2026-01-02",
  };

  const expectedBaseProfile = {
    id: 1,
    name: "Dipendu",
    email: "dipendu@example.com",
    avatar: "avatar.jpg",
    status: "ACTIVE",
    isEmailVerified: true,
    systemRole: baseUser.systemRole,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-02",
  };

  it("should serialize base profile fields", () => {
    // 1. Exact match for base fields
    expect(serializeProfile(baseUser)).toEqual(expectedBaseProfile);
  });

  it("should exclude unexpected/internal fields", () => {
    // 2. Ensure internal fields do not leak into the serialized response
    const userWithExtras = {
      ...baseUser,
      passwordHash: "super_secret_hash",
      refreshToken: "refresh_token_string",
      internalSecret: "hidden_value"
    };
    
    expect(serializeProfile(userWithExtras)).toEqual(expectedBaseProfile);
  });

  it("should omit functional roles by default", () => {
    // 3. functionalRoles should be undefined when options are not provided
    const userWithRoles = {
      ...baseUser,
      functionalRoles: [
        { functionalRole: { id: 10, name: "Content Manager", slug: "CONTENT_MANAGER" } }
      ]
    };

    const result = serializeProfile(userWithRoles);
    expect(result.functionalRoles).toBeUndefined();
  });

  it("should include functional roles when enabled", () => {
    // 4. functionalRoles should be accurately mapped when includeFunctionalRoles is true
    const userWithRoles = {
      ...baseUser,
      functionalRoles: [
        { functionalRole: { id: 10, name: "Content Manager", slug: "CONTENT_MANAGER" } },
        { functionalRole: { id: 20, name: "Editor", slug: "EDITOR" } },
      ]
    };

    const result = serializeProfile(userWithRoles, { includeFunctionalRoles: true });
    
    expect(result.functionalRoles).toEqual([
      { id: 10, name: "Content Manager", slug: "CONTENT_MANAGER" },
      { id: 20, name: "Editor", slug: "EDITOR" },
    ]);
  });

  it("should omit functional roles when explicitly disabled", () => {
    // 5. functionalRoles should remain undefined when explicitly passed as false
    const userWithRoles = {
      ...baseUser,
      functionalRoles: [
        { functionalRole: { id: 10, name: "Content Manager", slug: "CONTENT_MANAGER" } }
      ]
    };

    const result = serializeProfile(userWithRoles, { includeFunctionalRoles: false });
    expect(result.functionalRoles).toBeUndefined();
  });

  it("should omit functional roles when enabled but unavailable", () => {
    // 6. Explicitly passing functionalRoles as undefined should not crash or return an empty array
    const userWithoutRoles = {
      ...baseUser,
      functionalRoles: undefined
    };

    const result = serializeProfile(userWithoutRoles, { includeFunctionalRoles: true });
    expect(result.functionalRoles).toBeUndefined();
  });
});