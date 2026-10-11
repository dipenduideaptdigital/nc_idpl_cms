import { describe, it, expect } from "vitest";
import { hashToken } from "../../../src/shared/utils/tokenHash.js";

describe("tokenHash Utility", () => {
  describe("hashToken()", () => {
    it("should return deterministic hashes for the same token", () => {
      const token = "my-secret-token";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      
      expect(hash1).toBe(hash2);
    });

    it("should produce the exact SHA-256 hash for a known string", () => {
      const token = "hello";
      const expectedHash = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
      
      expect(hashToken(token)).toBe(expectedHash);
    });

    it("should generate different hashes for different tokens", () => {
      const hash1 = hashToken("token-one");
      const hash2 = hashToken("token-two");
      
      expect(hash1).not.toBe(hash2);
    });

    it("should output a 64-character hexadecimal string", () => {
      const hash = hashToken("test-format");
      
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should return a valid SHA-256 hash for an empty string", () => {
      const token = "";
      const expectedHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      
      expect(hashToken(token)).toBe(expectedHash);
    });
  });
});