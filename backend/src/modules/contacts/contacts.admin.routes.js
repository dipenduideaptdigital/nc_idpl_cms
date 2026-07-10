import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./contacts.controller.js";
import { 
  contactQuerySchema, 
  contactParamSchema, 
  updateContactStatusSchema,
  createInternalNoteSchema 
} from "./contacts.validation.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.get(
  "/metrics",
  requirePermission("contact.view"),
  controller.getAdminSubmissionsDashboardMetricsController
);

router.get(
  "/submissions",
  requirePermission("contact.view"),
  validate(contactQuerySchema, "query"),
  controller.getAdminSubmissionsCollectionController
);

router.get(
  "/submissions/:id",
  requirePermission("contact.view"),
  validate(contactParamSchema, "params"),
  controller.getAdminSubmissionAuditDetailsController
);

router.post(
  "/submissions/:id/notes",
  requirePermission("contact.view"),
  validate(contactParamSchema, "params"),
  validate(createInternalNoteSchema, "body"),
  controller.createAdminSubmissionInternalNoteController
);

router.patch(
  "/submissions/:id/status",
  requirePermission("contact.resolve"),
  validate(contactParamSchema, "params"),
  validate(updateContactStatusSchema, "body"),
  controller.updateAdminSubmissionWorkflowController
);

router.post(
  "/submissions/:id/restore",
  requirePermission("contact.resolve"),
  validate(contactParamSchema, "params"),
  controller.restoreExplicitAdminSubmissionOverrideController
);

router.delete(
  "/submissions/:id",
  requirePermission("contact.delete"),
  validate(contactParamSchema, "params"),
  controller.removeAdminSubmissionErasureController
);

export default router;