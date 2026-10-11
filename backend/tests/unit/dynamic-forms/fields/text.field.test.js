import { describe, it, expect } from "vitest";
import { TextField } from "../../../../src/modules/dynamic-forms/fields/text.field.js";

describe("TextField Builder", () => {
  it("TXT-01: should parse and trim valid required text", () => {
    const schema = TextField.buildZodSchema({ label: "Name", required: true });
    const result = schema.safeParse("  John Doe  ");
    expect(result.success).toBe(true);
    expect(result.data).toBe("John Doe");
  });

  it("TXT-02: should reject missing, empty, or whitespace-only required text", () => {
    const schema = TextField.buildZodSchema({ label: "Name", required: true });
    expect(schema.safeParse(undefined).success).toBe(false);
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("   ").success).toBe(false);
  });

  it("TXT-03: should accept omitted or empty string for optional fields", () => {
    const schema = TextField.buildZodSchema({ label: "Nickname", required: false });
    expect(schema.safeParse(undefined).success).toBe(true);
    expect(schema.safeParse("").success).toBe(true);
    expect(schema.safeParse("  ").success).toBe(true);
  });

  it("TXT-04: should enforce minLength boundary if provided", () => {
    const schema = TextField.buildZodSchema({ label: "Username", required: true, minLength: 5 });
    expect(schema.safeParse("1234").success).toBe(false); // Below boundary
    expect(schema.safeParse("12345").success).toBe(true); // Exact boundary
  });

  it("TXT-05: should enforce maxLength boundary if provided", () => {
    const schema = TextField.buildZodSchema({ label: "Title", required: true, maxLength: 10 });
    expect(schema.safeParse("1234567890").success).toBe(true); // Exact boundary
    expect(schema.safeParse("12345678901").success).toBe(false); // Above boundary
  });

  it("TXT-06: should enforce min/maxLength boundaries on optional fields", () => {
    const schema = TextField.buildZodSchema({ label: "Optional Code", required: false, minLength: 3, maxLength: 5 });
    expect(schema.safeParse("").success).toBe(true); // Allowed because it's optional
    expect(schema.safeParse("12").success).toBe(false); // Too short if provided
    expect(schema.safeParse("123456").success).toBe(false); // Too long if provided
    expect(schema.safeParse("1234").success).toBe(true); // Valid range
  });

  it("TXT-07: should reject non-string inputs", () => {
    const schema = TextField.buildZodSchema({ label: "Name", required: true });
    expect(schema.safeParse(123).success).toBe(false);
    expect(schema.safeParse({}).success).toBe(false);
    expect(schema.safeParse([]).success).toBe(false);
  });
});