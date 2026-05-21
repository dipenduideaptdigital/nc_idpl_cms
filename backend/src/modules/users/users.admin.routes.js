import { Router } from "express";
import { updateUserStatusController, updateUserRoleController } from "./users.admin.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { updateUserStatusSchema, updateSystemRoleSchema, userIdParamSchema } from "./users.validation.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.patch(
  "/:id/status",
  validate(userIdParamSchema, "params"),
  validate(updateUserStatusSchema, "body"),
  updateUserStatusController
);

router.patch(
  "/:id/role",
  validate(userIdParamSchema, "params"),
  validate(updateSystemRoleSchema, "body"),
  updateUserRoleController
);

export default router;