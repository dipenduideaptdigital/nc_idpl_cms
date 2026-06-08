import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { pageIdParamSchema } from "../pages/pages.validation.js";
import { createPreviewLinkController } from "./pages-preview.controller.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.post("/:id/preview-link", validate(pageIdParamSchema, "params"), createPreviewLinkController);

export default router;