import { describe, it, expect, vi, afterEach } from "vitest";
import {
  generateSecureToken,
  hashSecureToken,
  generateTokenExpiry,
} from "../../../src/shared/utils/secureToken.js";

describe("secureToken Utility", () => {
  describe("generateSecureToken()", () => {
    it("should generate a 64-character hex string by default", () => {
      // Default size (32 bytes -> 64 hex chars)
      const token = generateSecureToken();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(64);
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it("should generate a token of customized size (e.g., 16 bytes -> 32 hex chars)", () => {
      // Custom size (16 bytes -> 32 hex chars)
      const token = generateSecureToken(16);
      expect(typeof token).toBe("string");
      expect(token.length).toBe(32);
      expect(token).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe("hashSecureToken()", () => {
    it("should return the correct known SHA-256 hash for a specific input", () => {
      // Known SHA-256 output
      const hash = hashSecureToken("hello");
      expect(hash).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
    });

    it("should predictably generate the same hash for the same input", () => {
      //Deterministic hashing behavior
      const first = hashSecureToken("my-token");
      const second = hashSecureToken("my-token");
      expect(first).toBe(second);
    });
  });

  describe("generateTokenExpiry()", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should generate a Date exactly 15 minutes in the future by default", () => {
      // Default 15 minutes with fake timers
      const mockNow = new Date("2026-01-01T12:00:00.000Z");
      vi.useFakeTimers();
      vi.setSystemTime(mockNow);

      const expiry = generateTokenExpiry();
      const expectedExpiry = new Date("2026-01-01T12:15:00.000Z");
      
      expect(expiry.getTime()).toBe(expectedExpiry.getTime());
    });

    it("should generate a Date with customized minutes in the future", () => {
      // Custom minutes (30 minutes)
      const mockNow = new Date("2026-01-01T12:00:00.000Z");
      vi.useFakeTimers();
      vi.setSystemTime(mockNow);

      const expiry = generateTokenExpiry(30);
      const expectedExpiry = new Date("2026-01-01T12:30:00.000Z");
      
      expect(expiry.getTime()).toBe(expectedExpiry.getTime());
    });
  });
});