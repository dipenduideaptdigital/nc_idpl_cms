import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

import { saveDynamicFormSchema, updateSubmissionStatusSchema } from "./dynamic-forms.validation.js";
import * as controller from "./dynamic-forms.controller.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Create a new dynamic form
router.post(
  "/",
  requirePermission("form.create"),
  validate(saveDynamicFormSchema, "body"),
  controller.createFormController
);

router.get(
  "/",
  requirePermission("form.view"),
  controller.getAdminFormsListController
);

router.get(
  "/published-list",
  requirePermission("form.view"),
  controller.getPublishedFormsListController
);

router.patch(
  "/:id",
  requirePermission("form.edit"),
  validate(saveDynamicFormSchema, "body"),
  controller.updateFormController
);

router.get(
  "/:id",
  requirePermission("form.view"),
  controller.getAdminFormController
);

router.get("/:id/submissions", requirePermission("form.view"), controller.getFormSubmissionsController);
router.get("/submissions/:subId", requirePermission("form.view"), controller.getSubmissionDetailsController);
router.patch(
  "/submissions/:subId/status", 
  requirePermission("form.edit"), 
  validate(updateSubmissionStatusSchema, "body"), 
  controller.updateSubmissionStatusController
);
router.post("/submissions/:subId/notes", requirePermission("form.edit"), controller.addSubmissionNoteController);
router.delete("/submissions/:subId", requirePermission("form.delete"), controller.deleteSubmissionController);

export default router;