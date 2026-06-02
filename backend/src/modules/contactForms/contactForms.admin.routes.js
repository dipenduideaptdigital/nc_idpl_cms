import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as controller from "./contactForms.controller.js";
import { createContactFormSchema, updateContactFormSchema, formParamSchema } from "./contactForms.validation.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.post("/", validate(createContactFormSchema, "body"), controller.createFormInstanceController);
router.get("/", controller.getFormsCollectionController);
router.get("/:id", validate(formParamSchema, "params"), controller.getSingleFormProfileController);
router.patch("/:id", validate(formParamSchema, "params"), validate(updateContactFormSchema, "body"), controller.updateFormInstanceController);
router.delete("/:id", validate(formParamSchema, "params"), controller.removeFormInstanceController);

export default router;