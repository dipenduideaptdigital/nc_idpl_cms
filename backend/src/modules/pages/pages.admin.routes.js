import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
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

//  Structural Creation Layer
router.post(
  "/", 
  validate(createPageSchema, "body"), 
  controller.createPageController
);

// Multivariant Pagination List Core Filter Extraction
router.get(
  "/", 
  validate(pageQuerySchema, "query"), 
  controller.getAdminPagesListController
);

//  O(N) In-Memory Structural Hierarchy Tree Build
router.get(
  "/tree", 
  controller.getAdminPageTreeController
);

// REVISION SUBSYSTEM & VERSION CONTROL RUNTIME TRACKING ENGINE ROUTES

// Extracts full linear audit trail change history changelog of data blocks
router.get(
  "/:id/revisions",
  validate(pageIdParamSchema, "params"),
  controller.getPageRevisionsController
);

// Extracts a single atomic historical JSON snapshot checkpoint mapping data
router.get(
  "/:id/revisions/:revisionId",
  validate(pageRevisionParamSchema, "params"),
  controller.getSingleRevisionSnapshotController
);

// Executes an atomic rollback transaction restoring system records back to state snapshots
router.post(
  "/:id/revisions/:revisionId/restore",
  validate(pageRevisionParamSchema, "params"),
  controller.restoreRevisionSnapshotController
);

// RESOURCE MUTATION & INSTANCE MANIPULATION ROUTE LIFECYCLE

// Fetches isolated specific administrative page control datasets via dynamic ID
router.get(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  controller.getAdminPageByIdController
);

// Performs structural mutation patch layouts triggering downstream cascade pathing loops
router.patch(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  validate(updatePageSchema, "body"), 
  controller.updatePageController
);

// Triggers recursive sub-branch replication operations duplicating workspaces in RAM
router.post(
  "/:id/duplicate", 
  validate(pageIdParamSchema, "params"), 
  controller.duplicatePageController
);

// Enforces soft-delete blockades preserving parent integrity constraints
router.delete(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  controller.deletePageController
);

export default router;