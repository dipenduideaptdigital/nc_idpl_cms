import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import * as formService from "../../../src/modules/dynamic-forms/dynamic-forms.service.js";
import { sendResponse } from "../../../src/shared/utils/apiResponse.js";
import { generateRequestFingerprint } from "../../../src/shared/utils/fingerprint.js";
import * as controller from "../../../src/modules/dynamic-forms/dynamic-forms.controller.js";

// Mocks
vi.mock("../../../src/modules/dynamic-forms/dynamic-forms.service.js");
vi.mock("../../../src/shared/utils/apiResponse.js");
vi.mock("../../../src/shared/utils/fingerprint.js");

describe("Dynamic Forms Controller", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
      params: {},
      query: {},
      user: {},
      headers: {},
      socket: {},
    };
    res = {};
    next = vi.fn();
  });

  // ADMIN CONTROLLERS

  describe("createFormController", () => {
    it("should call service with correct arguments and send 201 response", async () => {
      req.body = { title: "New Form" };
      req.user.id = "admin-123";
      formService.createForm.mockResolvedValue({ id: "form-1" });

      await controller.createFormController(req, res, next);

      expect(formService.createForm).toHaveBeenCalledWith(req.body, "admin-123");
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.CREATED,
        message: "Form created successfully.",
        data: { id: "form-1" },
      });
    });

    it("should forward service errors to next()", async () => {
      const error = new Error("Service Error");
      formService.createForm.mockRejectedValue(error);

      await controller.createFormController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getPublishedFormsListController", () => {
    it("should fetch published forms and send 200 response", async () => {
      formService.getPublishedFormsList.mockResolvedValue([{ id: "1" }]);

      await controller.getPublishedFormsListController(req, res, next);

      expect(formService.getPublishedFormsList).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Published forms retrieved successfully for CMS.",
        data: [{ id: "1" }],
      });
    });
  });

  describe("getAdminFormController", () => {
    it("should fetch form by ID and send 200 response", async () => {
      req.params.id = "form-123";
      formService.getAdminForm.mockResolvedValue({ id: "form-123" });

      await controller.getAdminFormController(req, res, next);

      expect(formService.getAdminForm).toHaveBeenCalledWith("form-123");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: StatusCodes.OK, data: { id: "form-123" } })
      );
    });
  });

  describe("getAdminFormsListController", () => {
    it("should forward query and map forms to data and meta to meta", async () => {
      req.query = { page: "2", status: "PUBLISHED" };
      const mockResult = {
        forms: [{ id: "1" }, { id: "2" }],
        meta: { total: 2, page: 2 },
      };
      formService.getAdminFormsList.mockResolvedValue(mockResult);

      await controller.getAdminFormsListController(req, res, next);

      expect(formService.getAdminFormsList).toHaveBeenCalledWith(req.query);
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Forms retrieved successfully.",
        data: mockResult.forms,
        meta: mockResult.meta,
      });
    });

    it("should forward errors to next", async () => {
      const error = new Error("DB Error");
      formService.getAdminFormsList.mockRejectedValue(error);

      await controller.getAdminFormsListController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateFormController", () => {
    it("should call service with id, body, and user ID", async () => {
      req.params.id = "form-123";
      req.body = { title: "Updated" };
      req.user.id = "admin-1";
      formService.updateForm.mockResolvedValue({ id: "form-123", title: "Updated" });

      await controller.updateFormController(req, res, next);

      expect(formService.updateForm).toHaveBeenCalledWith("form-123", req.body, "admin-1");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: StatusCodes.OK, message: "Form updated successfully." })
      );
    });
  });

  // PUBLIC CONTROLLERS

  describe("getPublicFormController", () => {
    it("should fetch public form by slug", async () => {
      req.params.slug = "contact-us";
      formService.getPublicForm.mockResolvedValue({ slug: "contact-us" });

      await controller.getPublicFormController(req, res, next);

      expect(formService.getPublicForm).toHaveBeenCalledWith("contact-us");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: StatusCodes.OK, data: { slug: "contact-us" } })
      );
    });
  });

  describe("submitPublicFormController", () => {
    beforeEach(() => {
      req.params.slug = "contact-us";
      req.body.payload = { email: "test@example.com" };
      generateRequestFingerprint.mockReturnValue("fingerprint-123");
    });

    it("should extract correct metadata and call service successfully", async () => {
      req.headers = {
        "x-forwarded-for": "10.20.30.40",
        "user-agent": "Mozilla/5.0",
      };
      req.socket = { remoteAddress: "127.0.0.1" };
      formService.submitPublicForm.mockResolvedValue({ submissionId: "sub-1" });

      await controller.submitPublicFormController(req, res, next);

      expect(generateRequestFingerprint).toHaveBeenCalledWith(req);
      expect(formService.submitPublicForm).toHaveBeenCalledWith(
        "contact-us",
        req.body.payload,
        "10.20.30.40",
        "fingerprint-123",
        "Mozilla/5.0"
      );
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: StatusCodes.CREATED, message: "Submission processed successfully." })
      );
    });

    it("should extract the first IP from comma-separated x-forwarded-for", async () => {
      req.headers["x-forwarded-for"] = "10.20.30.40, 10.20.30.41";
      await controller.submitPublicFormController(req, res, next);
      expect(formService.submitPublicForm.mock.calls[0][2]).toBe("10.20.30.40");
    });

    it("should fallback to socket.remoteAddress if x-forwarded-for is missing", async () => {
      req.socket.remoteAddress = "192.168.1.100";
      await controller.submitPublicFormController(req, res, next);
      expect(formService.submitPublicForm.mock.calls[0][2]).toBe("192.168.1.100");
    });

    it("should fallback to 127.0.0.1 if both proxy and socket IPs are missing", async () => {
      await controller.submitPublicFormController(req, res, next);
      expect(formService.submitPublicForm.mock.calls[0][2]).toBe("127.0.0.1");
    });

    it("should fallback to 'unknown-agent' if user-agent header is missing", async () => {
      await controller.submitPublicFormController(req, res, next);
      expect(formService.submitPublicForm.mock.calls[0][4]).toBe("unknown-agent");
    });

    it("should forward service errors to next()", async () => {
      const error = new Error("Validation Error");
      formService.submitPublicForm.mockRejectedValue(error);
      await controller.submitPublicFormController(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // SUBMISSION MANAGEMENT CONTROLLERS

  describe("getFormSubmissionsController", () => {
    it("should pass form id and query, and return data without a specific message", async () => {
      req.params.id = "form-123";
      req.query = { limit: "10" };
      formService.getFormSubmissions.mockResolvedValue([]);

      await controller.getFormSubmissionsController(req, res, next);

      expect(formService.getFormSubmissions).toHaveBeenCalledWith("form-123", req.query);
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        data: [],
      });
    });
  });

  describe("getSubmissionDetailsController", () => {
    it("should pass subId and return details", async () => {
      req.params.subId = "sub-123";
      formService.getSubmissionDetails.mockResolvedValue({ id: "sub-123" });

      await controller.getSubmissionDetailsController(req, res, next);

      expect(formService.getSubmissionDetails).toHaveBeenCalledWith("sub-123");
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: StatusCodes.OK, data: { id: "sub-123" } })
      );
    });
  });

  describe("updateSubmissionStatusController", () => {
    it("should pass subId and status, and respond with message but no data", async () => {
      req.params.subId = "sub-123";
      req.body.status = "REVIEWED";

      await controller.updateSubmissionStatusController(req, res, next);

      expect(formService.updateSubmissionStatus).toHaveBeenCalledWith("sub-123", "REVIEWED");
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Status updated",
      });
    });
  });

  describe("addSubmissionNoteController", () => {
    it("should pass subId, userId, and text, and respond with 201", async () => {
      req.params.subId = "sub-123";
      req.user.id = "admin-1";
      req.body.text = "Contacted customer";
      formService.addSubmissionNote.mockResolvedValue({ id: "note-1" });

      await controller.addSubmissionNoteController(req, res, next);

      expect(formService.addSubmissionNote).toHaveBeenCalledWith("sub-123", "admin-1", "Contacted customer");
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.CREATED,
        message: "Note added",
        data: { id: "note-1" },
      });
    });
  });

  describe("deleteSubmissionController", () => {
    it("should pass subId to soft-delete service and respond with 200", async () => {
      req.params.subId = "sub-123";

      await controller.deleteSubmissionController(req, res, next);

      expect(formService.deleteSubmission).toHaveBeenCalledWith("sub-123");
      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message: "Submission deleted",
      });
    });

    it("should forward deletion errors to next()", async () => {
      req.params.subId = "sub-123";
      const error = new Error("Not Found");
      formService.deleteSubmission.mockRejectedValue(error);

      await controller.deleteSubmissionController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});