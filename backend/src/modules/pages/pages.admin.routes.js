import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./pages.controller.js";
import { 
  createPageSchema, 
  updatePageSchema, 
  pageQuerySchema, 
  pageIdParamSchema 
} from "./pages.validation.js";

const router = Router();

// Secure all routes
router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.post(
  "/", 
  validate(createPageSchema, "body"), 
  controller.createPageController
);

router.get(
  "/", 
  validate(pageQuerySchema, "query"), 
  controller.getAdminPagesListController
);

router.get(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  controller.getAdminPageByIdController
);

router.patch(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  validate(updatePageSchema, "body"), 
  controller.updatePageController
);

router.delete(
  "/:id", 
  validate(pageIdParamSchema, "params"), 
  controller.deletePageController
);

router.post(
  "/:id/duplicate", 
  validate(pageIdParamSchema, "params"), 
  controller.duplicatePageController
);

export default router;