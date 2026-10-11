
import { describe, it, expect } from "vitest";
import { EmailField } from "../../../../src/modules/dynamic-forms/fields/email.field.js";

describe("EmailField Builder", () => {
  it("EML-01: should accept and trim valid email addresses", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: true });
    const result = schema.safeParse("  test@example.com  ");
    expect(result.success).toBe(true);
    expect(result.data).toBe("test@example.com");
  });

  it("EML-02: should reject invalid email formats", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: true });
    expect(schema.safeParse("test@com").success).toBe(false);
    expect(schema.safeParse("not-an-email").success).toBe(false);
    expect(schema.safeParse("test@example..com").success).toBe(false);
  });

  it("EML-03: should reject missing or empty string if required", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: true });
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse(undefined).success).toBe(false);
  });

  it("EML-04: should accept missing or empty string if optional", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: false });
    expect(schema.safeParse("").success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
    // Even if whitespace is provided, it trims to empty string and should pass
    expect(schema.safeParse("   ").success).toBe(true);
  });

  it("EML-05: should reject invalid email format even if optional", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: false });
    expect(schema.safeParse("bad-email-format").success).toBe(false);
  });

  it("EML-06: should reject non-string inputs", () => {
    const schema = EmailField.buildZodSchema({ label: "Email", required: true });
    expect(schema.safeParse(12345).success).toBe(false);
  });
});