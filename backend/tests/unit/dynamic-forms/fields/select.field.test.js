
import { describe, it, expect } from "vitest";
import { SelectField } from "../../../../src/modules/dynamic-forms/fields/select.field.js";

describe("SelectField Builder", () => {
  it("SEL-01: should accept any non-empty string when required", () => {
    const schema = SelectField.buildZodSchema({ label: "Options", required: true });
    const result = schema.safeParse("  Option A  ");
    expect(result.success).toBe(true);
    expect(result.data).toBe("Option A"); // Trims space
  });

  it("SEL-02: should reject empty or whitespace-only selection if required", () => {
    const schema = SelectField.buildZodSchema({ label: "Options", required: true });
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("   ").success).toBe(false);
    expect(schema.safeParse(undefined).success).toBe(false);
  });

  it("SEL-03: should accept empty or missing selection if optional", () => {
    const schema = SelectField.buildZodSchema({ label: "Options", required: false });
    expect(schema.safeParse("").success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("SEL-04: should reject non-string inputs", () => {
    const schema = SelectField.buildZodSchema({ label: "Options", required: true });
    expect(schema.safeParse(["Option A"]).success).toBe(false);
    expect(schema.safeParse(1).success).toBe(false);
  });

  it("SEL-05: currently accepts arbitrary string data disregarding an options array", () => {
    const schema = SelectField.buildZodSchema({ label: "Options", required: true, options: ["A", "B"] });
    expect(schema.safeParse("Option C").success).toBe(true);
  });
});