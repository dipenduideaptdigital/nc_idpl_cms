import { describe, it, expect } from "vitest";
import { updateSystemStateSchema } from "../../../src/modules/system-state/systemState.validation.js";

describe("System State Validation", () => {
  const baseValidPayload = {
    state: "ACTIVE",
    version: 1,
  };

  describe("1. Valid payloads and allowed states", () => {
    it("SSV-01: Accepts a fully complete and valid payload", () => {
      const fullPayload = {
        state: "MAINTENANCE",
        version: 2,
        title: "  Maintenance Break  ", // intentionally added spaces to test trim
        description: "System is down for upgrades",
        estimatedCompletion: "2026-10-10T12:00:00.000Z",
        supportEmail: "support@example.com",
        supportPhone: "+91 9876543210",
        showSocialLinks: false,
        allowSearchEngine: false,
        bypassToken: "  abcdef123456  ",
        backgroundImage: "https://example.com/bg.jpg"
      };

      const result = updateSystemStateSchema.safeParse(fullPayload);
      
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Maintenance Break"); // trimmed
      expect(result.data.bypassToken).toBe("abcdef123456"); // trimmed
      expect(result.data.showSocialLinks).toBe(false);
    });

    it.each([
      "ACTIVE",
      "MAINTENANCE",
      "READ_ONLY",
      "EMERGENCY",
      "COMING_SOON"
    ])("SSV-02: Accepts valid state '%s'", (state) => {
      const result = updateSystemStateSchema.safeParse({ state, version: 1 });
      expect(result.success).toBe(true);
    });
  });

  describe("2. Required fields and state enum", () => {
    it("SSV-03: Rejects if required fields (state or version) are missing", () => {
      expect(updateSystemStateSchema.safeParse({ version: 1 }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ state: "ACTIVE" }).success).toBe(false);
    });

    it("SSV-04, SSV-05, SSV-06: Rejects unknown, case-sensitive, or null states", () => {
      const res1 = updateSystemStateSchema.safeParse({ state: "UNKNOWN", version: 1 });
      const res2 = updateSystemStateSchema.safeParse({ state: "maintenance", version: 1 }); // lowercase
      const res3 = updateSystemStateSchema.safeParse({ state: null, version: 1 });

      expect(res1.success).toBe(false);
      expect(res2.success).toBe(false);
      expect(res3.success).toBe(false);

      // Verify exact error message structure from Zod
      expect(res1.error.issues[0].message).toContain("Invalid option: expected one of");
    });
  });

  describe("3. Version constraints", () => {
    it("SSV-07 to SSV-11: Rejects invalid version formats and boundaries", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, version: 0 }).success).toBe(false); // min 1
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, version: -1 }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, version: 1.5 }).success).toBe(false); // must be int
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, version: "1" }).success).toBe(false); // no string coercion
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, version: null }).success).toBe(false);
    });
  });

  describe("4. Title and description boundaries", () => {
    it("SSV-12, SSV-13: Accepts omitted or null title/description", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, title: null, description: null }).success).toBe(true);
    });

    it("SSV-15, SSV-16: Validates title maximum length (150 chars)", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, title: "a".repeat(150) }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, title: "a".repeat(151) }).success).toBe(false);
    });

    it("SSV-17, SSV-18: Validates description maximum length (1000 chars)", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, description: "a".repeat(1000) }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, description: "a".repeat(1001) }).success).toBe(false);
    });

    it("SSV-20: Rejects incorrect types for text fields", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, title: 123 }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, description: {} }).success).toBe(false);
    });
  });

  describe("5. Estimated completion datetime", () => {
    it("SSV-21, SSV-22, SSV-23: Accepts omitted, null, or valid ISO datetime", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, estimatedCompletion: null }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, estimatedCompletion: "2026-10-10T12:00:00.000Z" }).success).toBe(true);
    });

    it("SSV-24, SSV-25, SSV-26: Rejects invalid datetime formats", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, estimatedCompletion: "not-a-date" }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, estimatedCompletion: "2026-13-45T25:61:00.000Z" }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, estimatedCompletion: 1234567890 }).success).toBe(false);
    });
  });

  describe("6. Support contact fields", () => {
    it("SSV-27, SSV-28, SSV-29: Validates email format", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportEmail: "admin@example.com" }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportEmail: null }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportEmail: "invalid-email" }).success).toBe(false);
    });

    it("SSV-30, SSV-31, SSV-32, SSV-33: Validates phone length and types", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportPhone: "1".repeat(25) }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportPhone: "1".repeat(26) }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportPhone: null }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, supportPhone: 9876543210 }).success).toBe(false); // expects string
    });
  });

  describe("7. Boolean defaults", () => {
    it("SSV-34, SSV-35, SSV-36: Applies 'true' default if boolean fields are omitted", () => {
      const result = updateSystemStateSchema.safeParse(baseValidPayload);
      expect(result.data.showSocialLinks).toBe(true);
      expect(result.data.allowSearchEngine).toBe(true);
    });

    it("SSV-37, SSV-38: Keeps explicit 'false' values", () => {
      const result = updateSystemStateSchema.safeParse({
        ...baseValidPayload,
        showSocialLinks: false,
        allowSearchEngine: false
      });
      expect(result.data.showSocialLinks).toBe(false);
      expect(result.data.allowSearchEngine).toBe(false);
    });

    it("SSV-39, SSV-40: Rejects strings or null for boolean fields", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, showSocialLinks: "true" }).success).toBe(false);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, allowSearchEngine: null }).success).toBe(false);
    });
  });

  describe("8. Bypass token and background image boundaries", () => {
    it("SSV-41 to SSV-45: Validates bypassToken bounds", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, bypassToken: null }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, bypassToken: "a".repeat(64) }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, bypassToken: "a".repeat(65) }).success).toBe(false);
    });

    it("SSV-46, SSV-47, SSV-48: Validates backgroundImage bounds", () => {
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, backgroundImage: null }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, backgroundImage: "a".repeat(2000) }).success).toBe(true);
      expect(updateSystemStateSchema.safeParse({ ...baseValidPayload, backgroundImage: "a".repeat(2001) }).success).toBe(false);
    });
  });

  describe("9. Strict object validation", () => {
    it("SSV-50: Rejects payload with unknown/unexpected fields", () => {
      const payloadWithExtraField = {
        ...baseValidPayload,
        unexpectedProperty: "should trigger failure"
      };

      const result = updateSystemStateSchema.safeParse(payloadWithExtraField);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(issue => issue.code === "unrecognized_keys")).toBe(true);
    });
  });
});