import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
} from "../../../src/shared/utils/password.js";

describe("Password Utility", () => {
  const plainPassword = "MyPassword123!";

  describe("hashPassword()", () => {
    it("should return a string different from the plain password", async () => {
      const hash = await hashPassword(plainPassword);
      
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(plainPassword);
    });

    it("should return a valid bcrypt-formatted hash", async () => {
      const hash = await hashPassword(plainPassword);
      
      // Broadly verifying bcrypt format (starts with $2a$, $2b$, or $2y$ followed by rounds and salt/hash)
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
    });

    it("should produce different hashes for the same password due to salting", async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword()", () => {
    it("should return true for the correct password", async () => {
      const hash = await hashPassword(plainPassword);
      const isValid = await comparePassword(plainPassword, hash);
      
      expect(isValid).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
      const hash = await hashPassword(plainPassword);
      const isInvalid = await comparePassword("WrongPassword123!", hash);
      
      expect(isInvalid).toBe(false);
    });
  });
});