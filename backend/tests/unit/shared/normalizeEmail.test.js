import { describe, it, expect } from "vitest";
import { normalizeEmail } from "../../../src/shared/utils/normalizeEmail.js";

describe("normalizeEmail()", () => {
  it("should keep a normal lowercase email unchanged", () => {
    expect(normalizeEmail("dipendu@example.com")).toBe("dipendu@example.com");
  });

  it("should convert an uppercase email to lowercase", () => {
    expect(normalizeEmail("DIPENDU@EXAMPLE.COM")).toBe("dipendu@example.com");
  });

  it("should convert a mixed-case email to lowercase", () => {
    expect(normalizeEmail("Dipendu.Mahata@Example.COM")).toBe("dipendu.mahata@example.com");
  });

  it("should remove leading whitespace", () => {
    expect(normalizeEmail("   dipendu@example.com")).toBe("dipendu@example.com");
  });

  it("should remove trailing whitespace", () => {
    expect(normalizeEmail("dipendu@example.com   ")).toBe("dipendu@example.com");
  });

  it("should remove both leading and trailing whitespace and convert to lowercase", () => {
    expect(normalizeEmail("   DIPENDU@EXAMPLE.COM   ")).toBe("dipendu@example.com");
  });

  it("should not remove internal spaces", () => {
    expect(normalizeEmail("dipendu @example.com")).toBe("dipendu @example.com");
  });

  it("should preserve meaningful email characters like dots, pluses, and subdomains", () => {
    expect(normalizeEmail("  User.Name+Test@Example.co.in  ")).toBe("user.name+test@example.co.in");
  });
});