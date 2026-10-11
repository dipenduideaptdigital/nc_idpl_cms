
import { describe, it, expect } from "vitest";
import { TextareaField } from "../../../../src/modules/dynamic-forms/fields/textarea.field.js";

describe("TextareaField Builder", () => {
  it("TXTA-01: should parse and trim valid required text", () => {
    const schema = TextareaField.buildZodSchema({ label: "Message", required: true });
    const result = schema.safeParse("  Hello World \n Test  ");
    expect(result.success).toBe(true);
    expect(result.data).toBe("Hello World \n Test");
  });

  it("TXTA-02: should reject empty or whitespace-only required text", () => {
    const schema = TextareaField.buildZodSchema({ label: "Message", required: true });
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("   \n   ").success).toBe(false);
  });

  it("TXTA-03: should accept optional missing or empty input", () => {
    const schema = TextareaField.buildZodSchema({ label: "Notes", required: false });
    expect(schema.safeParse(undefined).success).toBe(true);
    expect(schema.safeParse("").success).toBe(true);
  });

  it("TXTA-04: should enforce maxLength boundary", () => {
    const schema = TextareaField.buildZodSchema({ label: "Bio", required: true, maxLength: 20 });
    expect(schema.safeParse("A".repeat(20)).success).toBe(true);
    expect(schema.safeParse("A".repeat(21)).success).toBe(false);
  });

  it("TXTA-05: should reject non-string inputs", () => {
    const schema = TextareaField.buildZodSchema({ label: "Notes", required: true });
    expect(schema.safeParse(12345).success).toBe(false);
  });
});