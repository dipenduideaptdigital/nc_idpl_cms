import { describe, it, expect, vi, beforeEach } from "vitest";
import * as formService from "../../../src/modules/dynamic-forms/dynamic-forms.service.js";
import { prisma } from "../../../src/config/db.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mocking Prisma DB
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    dynamicForm: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    formSubmission: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    formSubmissionNote: {
      create: vi.fn(),
    },
  },
}));

describe("Dynamic Forms Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ADMIN SERVICE TESTS
  
  describe("ADMIN - createForm()", () => {
    it("TC-1 & TC-4: should generate slug from title if not provided and create form", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(null);
      prisma.dynamicForm.create.mockResolvedValue({ id: "form_1", slug: "contact-form" });

      await formService.createForm({ title: "Contact Form" }, "admin_1");

      expect(prisma.dynamicForm.findUnique).toHaveBeenCalledWith({ where: { slug: "contact-form" } });
      expect(prisma.dynamicForm.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: "contact-form", authorId: "admin_1", updatedById: "admin_1" })
        })
      );
    });

    it("TC-2: should use supplied slug and normalize it", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(null);
      await formService.createForm({ title: "Any Title", slug: "Custom Form Slug" }, "admin_1");

      expect(prisma.dynamicForm.findUnique).toHaveBeenCalledWith({ where: { slug: "custom-form-slug" } });
    });

    it("TC-3: should throw 409 Conflict if slug already exists and NOT call create", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue({ id: "existing_form" });

      await expect(formService.createForm({ title: "Duplicate" }, "admin_1")).rejects.toThrow(AppError);
      expect(prisma.dynamicForm.create).not.toHaveBeenCalled();
    });
  });

  describe("ADMIN - getPublishedFormsList()", () => {
    it("TC-5: should query only published forms and return id, title, slug", async () => {
      prisma.dynamicForm.findMany.mockResolvedValue([{ id: "1", title: "F1", slug: "f1" }]);
      
      const result = await formService.getPublishedFormsList();
      
      expect(prisma.dynamicForm.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "PUBLISHED", deletedAt: null },
          select: { id: true, title: true, slug: true }
        })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("ADMIN - getAdminForm()", () => {
    it("TC-6: should return form if exists", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue({ id: "form_1" });
      const result = await formService.getAdminForm("form_1");
      expect(result.id).toBe("form_1");
    });

    it("TC-7: should throw 404 if form doesn't exist", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(null);
      await expect(formService.getAdminForm("invalid")).rejects.toThrow(AppError);
    });
  });

  describe("ADMIN - getAdminFormsList()", () => {
    it("TC-8 & TC-13: should apply default pagination and return meta data", async () => {
      prisma.dynamicForm.findMany.mockResolvedValue([]);
      prisma.dynamicForm.count.mockResolvedValue(25); // Total forms

      const result = await formService.getAdminFormsList({});

      expect(prisma.dynamicForm.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 10 }));
      expect(result.meta).toEqual({ total: 25, page: 1, limit: 10, totalPages: 3 });
    });

    it("TC-9: should calculate custom pagination correctly", async () => {
      prisma.dynamicForm.findMany.mockResolvedValue([]);
      prisma.dynamicForm.count.mockResolvedValue(50);

      await formService.getAdminFormsList({ page: 3, limit: 20 });

      expect(prisma.dynamicForm.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 40, take: 20 }));
    });

    
  it("TC-12: should combine status and search filters", async () => {
    prisma.dynamicForm.findMany.mockResolvedValue([]);
    prisma.dynamicForm.count.mockResolvedValue(0);

    await formService.getAdminFormsList({
      status: "PUBLISHED",
      search: "contact",
    });

    expect(prisma.dynamicForm.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
          OR: [
            { title: { contains: "contact" } },
            { slug: { contains: "contact" } },
          ],
        },
      })
    );
  });

  });

  describe("ADMIN - updateForm()", () => {
    const existingForm = { id: "form_1", version: 3, slug: "old-slug", schema: { fields: [] } };

    it("TC-14: should throw 404 if form does not exist", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(null);
      await expect(formService.updateForm("form_1", {}, "admin_1")).rejects.toThrow(AppError);
      expect(prisma.dynamicForm.update).not.toHaveBeenCalled();
    });

    it("TC-15: should NOT increment version if schema is unchanged", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(existingForm);
      prisma.dynamicForm.update.mockResolvedValue({ version: 3 });

      await formService.updateForm("form_1", { schema: { fields: [] } }, "admin_1");

      expect(prisma.dynamicForm.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ version: 3 }) })
      );
    });

    it("TC-16 & TC-17: should increment version if schema is changed", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(existingForm);
      prisma.dynamicForm.update.mockResolvedValue({ version: 4 });

      await formService.updateForm("form_1", { schema: { fields: [{ type: "text", key: "name" }] } }, "admin_1");

      expect(prisma.dynamicForm.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ version: 4 }) })
      );
    });

    it("TC-18: should preserve existing slug if not explicitly updated", async () => {
      prisma.dynamicForm.findUnique.mockResolvedValue(existingForm);
      
      await formService.updateForm("form_1", { schema: { fields: [] } }, "admin_1");

      expect(prisma.dynamicForm.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.dynamicForm.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ slug: "old-slug" }) })
      );
    });

    it("TC-20: should throw 409 if new slug belongs to another form", async () => {
      prisma.dynamicForm.findUnique
        .mockResolvedValueOnce(existingForm) // Fetch current
        .mockResolvedValueOnce({ id: "another_form" }); // Slug conflict check

      await expect(formService.updateForm("form_1", { slug: "new-slug", schema: { fields: [] } }, "admin_1")).rejects.toThrow(AppError);
      expect(prisma.dynamicForm.update).not.toHaveBeenCalled();
    });
  });

  // PUBLIC SERVICE TESTS

  describe("PUBLIC - getPublicForm()", () => {
    it("TC-22 & TC-23: should throw 404 if form is unpublished or deleted (not found)", async () => {
      prisma.dynamicForm.findFirst.mockResolvedValue(null);
      await expect(formService.getPublicForm("contact")).rejects.toThrow(AppError);
    });

    it("TC-24 & TC-25: should return valid shape and sanitize internal settings", async () => {
      const mockForm = {
        id: "form_1",
        title: "Contact",
        version: 1,
        schema: { fields: [] },
        settings: { submitButton: "Send", successAction: "Message", secretKey: "HIDDEN", adminEmail: "admin@test.com" }
      };
      prisma.dynamicForm.findFirst.mockResolvedValue(mockForm);

      const result = await formService.getPublicForm("contact");

      expect(result).toHaveProperty("schema");
      expect(result.settings).toHaveProperty("submitButton", "Send");
      expect(result.settings).toHaveProperty("successAction", "Message");
      expect(result.settings).not.toHaveProperty("secretKey");
      expect(result.settings).not.toHaveProperty("adminEmail");
    });
  });

  describe("PUBLIC - submitPublicForm()", () => {
    const validForm = {
      id: "form_1",
      version: 2,
      schema: { fields: [{ key: "email", type: "email", required: true }] },
      settings: { successAction: { message: "Thanks!" } }
    };

    it("TC-26: should reject submission if form is unavailable", async () => {
      prisma.dynamicForm.findFirst.mockResolvedValue(null);
      await expect(formService.submitPublicForm("contact", {}, "127.0.0.1", "fp", "agent")).rejects.toThrow(AppError);
    });

    it("TC-27, TC-28 & TC-34: should accept valid submission, store formVersion, and return successAction", async () => {
      prisma.dynamicForm.findFirst.mockResolvedValue(validForm);
      prisma.formSubmission.create.mockResolvedValue({ id: "sub_1" });

      const result = await formService.submitPublicForm("contact", { email: "test@example.com" }, "1.2.3.4", "fingerprint", "userAgent");

      expect(prisma.formSubmission.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            formId: "form_1",
            formVersion: 2,
            payload: { email: "test@example.com" },
            ipAddress: "1.2.3.4"
          })
        })
      );
      expect(result).toEqual({ submissionId: "sub_1", successAction: validForm.settings.successAction });
    });

    it("TC-29 & TC-32: should reject invalid field values and NOT write to DB", async () => {
      prisma.dynamicForm.findFirst.mockResolvedValue(validForm);

      await expect(
        formService.submitPublicForm("contact", { email: "invalid-email" }, "ip", "fp", "ua")
      ).rejects.toThrow(AppError);
      
      expect(prisma.formSubmission.create).not.toHaveBeenCalled();
    });

    it("TC-30: should reject unknown extra fields strictly to prevent malicious injections", async () => {
      prisma.dynamicForm.findFirst.mockResolvedValue(validForm);

      await expect(
        formService.submitPublicForm("contact", { email: "test@example.com", isAdmin: true }, "ip", "fp", "ua")
      ).rejects.toThrow(AppError);

      expect(prisma.formSubmission.create).not.toHaveBeenCalled();
    });
  });

  // SUBMISSION MANAGEMENT TESTS

  describe("SUBMISSION MANAGEMENT", () => {
    describe("getFormSubmissions()", () => {
      it("TC-35, TC-36 & TC-38: should apply filters, limits and order by createdAt desc", async () => {
        prisma.formSubmission.findMany.mockResolvedValue([]);
        
        await formService.getFormSubmissions("form_1", { status: "NEW", limit: 20 });

        expect(prisma.formSubmission.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { formId: "form_1", deletedAt: null, status: "NEW" },
            take: 20,
            orderBy: { createdAt: "desc" }
          })
        );
      });
    });

    describe("getSubmissionDetails()", () => {
      it("TC-39: should throw 404 if submission not found", async () => {
        prisma.formSubmission.findUnique.mockResolvedValue(null);
        await expect(formService.getSubmissionDetails("invalid")).rejects.toThrow(AppError);
      });

      it("TC-41: should mark as viewed if it was not viewed", async () => {
        prisma.formSubmission.findUnique.mockResolvedValue({ id: "sub_1", isViewed: false });
        prisma.formSubmission.update.mockResolvedValue(true);

        const result = await formService.getSubmissionDetails("sub_1");

        expect(prisma.formSubmission.update).toHaveBeenCalledWith({ where: { id: "sub_1" }, data: { isViewed: true } });
        expect(result.isViewed).toBe(true);
      });

      it("TC-40: should NOT update if already viewed", async () => {
        prisma.formSubmission.findUnique.mockResolvedValue({ id: "sub_1", isViewed: true });

        await formService.getSubmissionDetails("sub_1");

        expect(prisma.formSubmission.update).not.toHaveBeenCalled();
      });
    });

    describe("updateSubmissionStatus() & addSubmissionNote()", () => {
      it("TC-42: should update status properly", async () => {
        await formService.updateSubmissionStatus("sub_1", "RESOLVED");
        expect(prisma.formSubmission.update).toHaveBeenCalledWith({ where: { id: "sub_1" }, data: { status: "RESOLVED" } });
      });

      it("TC-43: should create a note properly", async () => {
        await formService.addSubmissionNote("sub_1", "admin_1", "Follow up done.");
        expect(prisma.formSubmissionNote.create).toHaveBeenCalledWith({
          data: { submissionId: "sub_1", authorId: "admin_1", text: "Follow up done." }
        });
      });
    });

    describe("deleteSubmission()", () => {
      it("TC-44: should soft delete the submission by updating deletedAt", async () => {
        await formService.deleteSubmission("sub_1");
        expect(prisma.formSubmission.update).toHaveBeenCalledWith({
          where: { id: "sub_1" },
          data: { deletedAt: expect.any(Date) }
        });
      });
    });
  });
});