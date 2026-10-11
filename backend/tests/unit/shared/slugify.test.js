import { describe, it, expect } from "vitest";
import { generateSlug } from "../../../src/shared/utils/slugify.js";

describe("generateSlug()", () => {
  it("should convert normal text to a basic slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("should convert uppercase to lowercase and trim surrounding spaces", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("should replace the '&' character with 'and'", () => {
    expect(generateSlug("Nature & Environment")).toBe("nature-and-environment");
  });

  it("should normalize multiple spaces and collapse repeated hyphens", () => {
    expect(generateSlug("Hello   ---   World")).toBe("hello-world");
  });

  it("should normalize accented and Unicode characters", () => {
    expect(generateSlug("Café Déjà Vu")).toBe("cafe-deja-vu");
  });

  it("should remove special characters that are not allowed", () => {
    expect(generateSlug("Hello, World! @#$%")).toBe("hello-world");
  });

  it("should preserve the forward slash (/) character", () => {
    expect(generateSlug("Products/Featured Items")).toBe("products/featured-items");
  });

  it("should enforce a maximum length of 150 characters", () => {
    const longText = "a".repeat(200);
    const result = generateSlug(longText);
    expect(result).toHaveLength(150);
    expect(result).toBe("a".repeat(150));
  });

  it("should return an empty string for falsey inputs", () => {
    expect(generateSlug("")).toBe("");
    expect(generateSlug(null)).toBe("");
    expect(generateSlug(undefined)).toBe("");
  });
});