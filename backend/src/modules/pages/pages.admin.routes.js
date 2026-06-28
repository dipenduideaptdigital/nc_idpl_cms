import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js"; // Import added
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./pages.controller.js";
import { 
  createPageSchema, 
  updatePageSchema, 
  pageQuerySchema, 
  pageIdParamSchema,
  pageRevisionParamSchema 
} from "./pages.validation.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Structural Creation Layer
router.post(
  "/", 
  requirePermission("page.create"), 
  validate(createPageSchema, "body"), 
  controller.createPageController
);

router.get(
  "/", 
  requirePermission("page.view"), 
  validate(pageQuerySchema, "query"), 
  controller.getAdminPagesListController
);

router.get(
  "/tree", 
  requirePermission("page.view"),
  controller.getAdminPageTreeController
);

// REVISION SUBSYSTEM & VERSION CONTROL
router.get(
  "/:id/revisions",
  requirePermission("page.view"), 
  validate(pageIdParamSchema, "params"),
  controller.getPageRevisionsController
);

router.get(
  "/:id/revisions/:revisionId",
  requirePermission("page.view"), 
  validate(pageRevisionParamSchema, "params"),
  controller.getSingleRevisionSnapshotController
);

router.post(
  "/:id/revisions/:revisionId/restore",
  requirePermission("page.edit"), 
  validate(pageRevisionParamSchema, "params"),
  controller.restoreRevisionSnapshotController
);

router.get(
  "/:id", 
  requirePermission("page.view"), 
  validate(pageIdParamSchema, "params"), 
  controller.getAdminPageByIdController
);

router.patch(
  "/:id", 
  requirePermission("page.edit"), 
  validate(pageIdParamSchema, "params"), 
  validate(updatePageSchema, "body"), 
  controller.updatePageController
);

router.post(
  "/:id/duplicate", 
  requirePermission("page.create"), 
  validate(pageIdParamSchema, "params"), 
  controller.duplicatePageController
);

router.delete(
  "/:id", 
  requirePermission("page.delete"), 
  validate(pageIdParamSchema, "params"), 
  controller.deletePageController
);

export default router;