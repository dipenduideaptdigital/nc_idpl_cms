import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { createFunctionalRoleSchema, updateFunctionalRoleSchema, roleIdParamSchema } from "./roles.validation.js";
import * as controller from "./roles.controller.js";

const router = Router();

router.use(authenticate);

router.get("/permissions", requirePermission("role.view"), controller.getSystemPermissionsController);

router.post("/", requirePermission("role.create"), validate(createFunctionalRoleSchema, "body"), controller.createRoleController);
router.get("/", requirePermission("role.view"), controller.getAllRolesController);
router.get("/:id", requirePermission("role.view"), validate(roleIdParamSchema, "params"), controller.getRoleDetailsController);
router.patch("/:id", requirePermission("role.edit"), validate(roleIdParamSchema, "params"), validate(updateFunctionalRoleSchema, "body"), controller.updateRoleController);
router.delete("/:id", requirePermission("role.delete"), validate(roleIdParamSchema, "params"), controller.deleteRoleController);

export default router;