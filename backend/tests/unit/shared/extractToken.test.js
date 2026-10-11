import { describe, it, expect } from "vitest";
import { extractBearerToken } from "../../../src/shared/utils/extractToken.js";

describe("extractToken Utility", () => {
  describe("extractBearerToken()", () => {
    it("should return null for undefined/no authorization header", () => {
      // No authorization header
      expect(extractBearerToken(undefined)).toBeNull();
    });

    it("should return null for an empty header", () => {
      //  Empty header
      expect(extractBearerToken("")).toBeNull();
    });

    it("should return the token for a valid Bearer string", () => {
      // Valid Bearer token (Happy path)
      expect(extractBearerToken("Bearer abc123")).toBe("abc123");
    });

    it("should return null for an invalid authentication scheme (e.g., Basic)", () => {
      //  Invalid authentication scheme
      expect(extractBearerToken("Basic abc123")).toBeNull();
    });

    it("should return null if 'Bearer' is lowercase", () => {
      //  Lowercase bearer reject
      expect(extractBearerToken("bearer abc123")).toBeNull();
    });

    it("should return null for invalid token formats or extra parts", () => {
      // Invalid token format / extra parts
      expect(extractBearerToken("Bearer")).toBeNull();
      expect(extractBearerToken("Bearer abc123 extra")).toBeNull();
    });
  });
});