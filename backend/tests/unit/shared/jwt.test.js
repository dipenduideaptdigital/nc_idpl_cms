import { describe, it, expect } from "vitest";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../../src/shared/utils/jwt.js";

describe("JWT Utilities", () => {
  const mockPayload = {
    userId: "user_123",
    role: "ADMIN",
    email: "admin@example.com",
  };

  describe("generateAccessToken()", () => {
    it("should generate an access token string from a valid payload", () => {
      const token = generateAccessToken(mockPayload);
      expect(typeof token).toBe("string");
    });

    it("should preserve the payload when verified", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });

  describe("generateRefreshToken()", () => {
    it("should generate a refresh token string from a valid payload", () => {
      const token = generateRefreshToken(mockPayload);
      expect(typeof token).toBe("string");
    });

    it("should preserve the payload when verified", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.email).toBe(mockPayload.email);
    });
  });

  describe("token separation", () => {
    it("should not verify an access token using the refresh token verifier", () => {
      const accessToken = generateAccessToken(mockPayload);
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });

    it("should not verify a refresh token using the access token verifier", () => {
      const refreshToken = generateRefreshToken(mockPayload);
      expect(() => verifyAccessToken(refreshToken)).toThrow();
    });
  });

  describe("token verification failures", () => {
    it("should reject an invalid access token", () => {
      expect(() => verifyAccessToken("this-is-not-a-valid-jwt")).toThrow();
    });

    it("should reject an invalid refresh token", () => {
      expect(() => verifyRefreshToken("invalid-refresh-token")).toThrow();
    });
  });
});