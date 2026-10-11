import { describe, it, expect } from "vitest";
import {
  saveDynamicFormSchema,
  updateSubmissionStatusSchema,
} from "../../../src/modules/dynamic-forms/dynamic-forms.validation.js";

// Base valid payload to avoid repetition
const validForm = {
  title: "Contact Form",
  slug: "contact-form",
  description: "Contact us",
  status: "DRAFT",
  schema: {
    version: 1,
    fields: [
      {
        id: "field-1",
        key: "name",
        type: "text",
        label: "Name",
        placeholder: "Enter your name",
        required: true,
      },
    ],
  },
  settings: {
    submitButton: {
      text: "Submit",
      processingText: "Please wait...",
    },
    successAction: {
      type: "message",
      message: "Thank you!",
    },
  },
};

describe("Dynamic Forms Validation Schemas", () => {
  describe("saveDynamicFormSchema", () => {
    it("should successfully validate a completely valid form", () => {
      const result = saveDynamicFormSchema.safeParse(validForm);
      expect(result.success).toBe(true);
    });

    describe("Title Validation", () => {
      it("should trim the title", () => {
        const payload = { ...validForm, title: "   Contact Form   " };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
        expect(result.data.title).toBe("Contact Form");
      });

      it("should reject title shorter than 2 characters", () => {
        const payload = { ...validForm, title: "A" };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });

      it("should reject title longer than 150 characters", () => {
        const payload = { ...validForm, title: "A".repeat(151) };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe("Slug Validation", () => {
      it("should normalize slug (trim and lowercase)", () => {
        const payload = { ...validForm, slug: "  Contact-US  " };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
        expect(result.data.slug).toBe("contact-us");
      });

      it("should allow omitted slug", () => {
        const payload = structuredClone(validForm);
        delete payload.slug;
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it("should reject invalid slug characters", () => {
        const payload = { ...validForm, slug: "contact_us!" };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe("Description Validation", () => {
      it("should allow description to be omitted or null", () => {
        const payload1 = structuredClone(validForm);
        delete payload1.description;
        expect(saveDynamicFormSchema.safeParse(payload1).success).toBe(true);

        const payload2 = { ...validForm, description: null };
        expect(saveDynamicFormSchema.safeParse(payload2).success).toBe(true);
      });
    });

    describe("Status Validation & Defaults", () => {
      it.each(["DRAFT", "PUBLISHED", "ARCHIVED"])("should accept valid status: %s", (status) => {
        const payload = { ...validForm, status };
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(true);
      });

      it("should reject invalid status", () => {
        const payload = { ...validForm, status: "DELETED" };
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });

      it("should default to DRAFT if status is missing", () => {
        const payload = structuredClone(validForm);
        delete payload.status;
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
        expect(result.data.status).toBe("DRAFT");
      });
    });

    describe("Top-level Strictness", () => {
      it("should reject unknown top-level properties", () => {
        const payload = { ...validForm, maliciousField: "hack" };
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe("Schema & Version Validation", () => {
      it("should default version to 1 if missing", () => {
        const payload = structuredClone(validForm);
        delete payload.schema.version;
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
        expect(result.data.schema.version).toBe(1);
      });
    });

    describe("Fields Validation", () => {
      it("should accept empty fields array", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields = [];
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(true);
      });

      it("should reject if required field properties (id, key, type, label) are missing", () => {
        const payload = structuredClone(validForm);
        delete payload.schema.fields[0].id;
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });

      it("should reject invalid field key formats", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields[0].key = "first-name"; // Hyphens not allowed
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });

      it("should accept supported field types", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields[0].type = "email";
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(true);
      });

      it("should reject unsupported field types", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields[0].type = "datepicker";
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });

      it("should default required property to false if missing", () => {
        const payload = structuredClone(validForm);
        delete payload.schema.fields[0].required;
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
        expect(result.data.schema.fields[0].required).toBe(false);
      });

      it("should allow extra custom field configurations (catchall)", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields[0].minLength = 5;
        payload.schema.fields[0].options = ["A", "B"];
        const result = saveDynamicFormSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it("should reject duplicate field keys", () => {
        const payload = structuredClone(validForm);
        payload.schema.fields.push({
          id: "field-2",
          key: "name", // Duplicate key
          type: "text",
          label: "Another Name"
        });
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });
    });

    describe("Settings Validation & Defaults", () => {
      it("should apply defaults for missing submitButton and successAction message", () => {
        const payload = structuredClone(validForm);
        payload.settings = {}; // Empty settings
        const result = saveDynamicFormSchema.safeParse(payload);
        
        expect(result.success).toBe(true);
        expect(result.data.settings.submitButton.text).toBe("Submit");
        expect(result.data.settings.submitButton.processingText).toBe("Please wait...");
        expect(result.data.settings.successAction.type).toBe("message");
        expect(result.data.settings.successAction.message).toBe("Thank you! Your submission has been received.");
      });

      it("should reject invalid successAction types", () => {
        const payload = structuredClone(validForm);
        payload.settings.successAction.type = "popup"; // Invalid type
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(false);
      });

      it("should allow custom settings properties (catchall)", () => {
        const payload = structuredClone(validForm);
        payload.settings.adminEmail = "admin@example.com";
        expect(saveDynamicFormSchema.safeParse(payload).success).toBe(true);
      });
    });
  });

  describe("updateSubmissionStatusSchema", () => {
    it.each(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"])(
      "should accept valid status: %s",
      (status) => {
        const result = updateSubmissionStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      }
    );

    it("should reject invalid statuses", () => {
      const result = updateSubmissionStatusSchema.safeParse({ status: "REVIEWED" });
      expect(result.success).toBe(false);
    });

    it("should reject if status is missing", () => {
      const result = updateSubmissionStatusSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject unknown properties (strict)", () => {
      const result = updateSubmissionStatusSchema.safeParse({
        status: "NEW",
        extra: "data",
      });
      expect(result.success).toBe(false);
    });
  });
});