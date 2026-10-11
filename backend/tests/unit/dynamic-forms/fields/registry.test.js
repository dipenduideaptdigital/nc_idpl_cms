// tests/unit/dynamic-forms/fields/registry.test.js
import { describe, it, expect } from "vitest";
import { FieldRegistry } from "../../../../src/modules/dynamic-forms/fields/registry.js";

describe("Field Registry", () => {
  const supportedTypes = ["text", "email", "textarea", "phone", "select"];

  it("REG-01: should return true for isSupported() for all active types", () => {
    supportedTypes.forEach((type) => {
      expect(FieldRegistry.isSupported(type)).toBe(true);
    });
  });

  it("REG-02: should return false for isSupported() for unknown types", () => {
    expect(FieldRegistry.isSupported("datepicker")).toBe(false);
    expect(FieldRegistry.isSupported("checkbox")).toBe(false);
    expect(FieldRegistry.isSupported(null)).toBe(false);
    expect(FieldRegistry.isSupported("")).toBe(false);
  });

  it("REG-03: should return a schema builder function via getZodBuilder() for supported types", () => {
    supportedTypes.forEach((type) => {
      const builder = FieldRegistry.getZodBuilder(type);
      expect(typeof builder).toBe("function");
    });
  });

  it("REG-04: should throw an error from getZodBuilder() for unsupported types", () => {
    expect(() => FieldRegistry.getZodBuilder("file")).toThrow("Unsupported field type: file");
    expect(() => FieldRegistry.getZodBuilder("radio")).toThrow("Unsupported field type: radio");
  });
});