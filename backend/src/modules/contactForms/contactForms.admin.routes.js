import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./contactForms.controller.js";
import { createContactFormSchema, updateContactFormSchema, formParamSchema } from "./contactForms.validation.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Protected Routes
router.post("/", requirePermission("contact_form.create"), validate(createContactFormSchema, "body"), controller.createFormInstanceController);
router.get("/", requirePermission("contact_form.view"), controller.getFormsCollectionController);
router.get("/:id", requirePermission("contact_form.view"), validate(formParamSchema, "params"), controller.getSingleFormProfileController);
router.patch("/:id", requirePermission("contact_form.edit"), validate(formParamSchema, "params"), validate(updateContactFormSchema, "body"), controller.updateFormInstanceController);
router.delete("/:id", requirePermission("contact_form.delete"), validate(formParamSchema, "params"), controller.removeFormInstanceController);

export default router;