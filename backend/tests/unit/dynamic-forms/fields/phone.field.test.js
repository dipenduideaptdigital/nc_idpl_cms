
import { describe, it, expect } from "vitest";
import { PhoneField } from "../../../../src/modules/dynamic-forms/fields/phone.field.js";

describe("PhoneField Builder", () => {
  it("PHN-01: should accept valid standard phone numbers", () => {
    const schema = PhoneField.buildZodSchema({ label: "Phone", required: true });
    expect(schema.safeParse("+1234567890").success).toBe(true);
    expect(schema.safeParse("(123) 456-7890").success).toBe(true);
    expect(schema.safeParse("+91 98765-43210").success).toBe(true);
    expect(schema.safeParse("123.456.7890").success).toBe(true);
  });

  it("PHN-02: should reject missing, empty, or whitespace-only if required", () => {
    const schema = PhoneField.buildZodSchema({ label: "Phone", required: true });
    expect(schema.safeParse(undefined).success).toBe(false);
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("   ").success).toBe(false);
  });

  it("PHN-03: should reject alphabetic or severely malformed strings", () => {
    const schema = PhoneField.buildZodSchema({ label: "Phone", required: true });
    expect(schema.safeParse("Call me").success).toBe(false);
    expect(schema.safeParse("+123abc456").success).toBe(false);
  });

  it("PHN-04: should accept empty or undefined if optional", () => {
    const schema = PhoneField.buildZodSchema({ label: "Phone", required: false });
    expect(schema.safeParse("").success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("PHN-05: should reject malformed number even if optional", () => {
    const schema = PhoneField.buildZodSchema({ label: "Phone", required: false });
    expect(schema.safeParse("invalid123").success).toBe(false);
  });
});