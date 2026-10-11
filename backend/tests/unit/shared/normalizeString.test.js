import { describe, it, expect } from "vitest";
import { normalizeString } from "../../../src/shared/utils/normalizeString.js";

describe("normalizeString()", () => {
  it("should keep a normal string unchanged and preserve case", () => {
    expect(normalizeString("Hello World")).toBe("Hello World");
  });

  it("should remove leading and trailing whitespace", () => {
    expect(normalizeString("   Hello World   ")).toBe("Hello World");
  });

  it("should preserve internal whitespace", () => {
    expect(normalizeString("Hello   World")).toBe("Hello   World");
  });

  it("should apply NFKC normalization to full-width characters", () => {
    expect(normalizeString("ＡＢＣ")).toBe("ABC");
  });

  it("should return an empty string when given an empty string", () => {
    expect(normalizeString("")).toBe("");
  });

  it("should return undefined for null or undefined inputs", () => {
    expect(normalizeString(null)).toBeUndefined();
    expect(normalizeString(undefined)).toBeUndefined();
  });
});