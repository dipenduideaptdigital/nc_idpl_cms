import { Router } from "express";
import { 
  updateUserStatusController, 
  updateUserRoleController,
  assignUserFunctionalRolesController,
  getUserFunctionalRolesController,
  getAllUsersController,  
  inviteAdminController,
  getUserDetailsController,
  revokeSessionsController,
  cancelInviteController 
} from "./users.admin.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { 
  updateUserStatusSchema, 
  updateSystemRoleSchema, 
  userIdParamSchema,
  assignFunctionalRolesSchema,
  inviteAdminSchema,           
  userQuerySchema          
} from "./users.validation.js";

const router = Router();

// Base 
router.use(authenticate);

//Get All Users (Admin/Staff List)
router.get(
  "/",
  requirePermission("user.view"),
  validate(userQuerySchema, "query"),
  getAllUsersController
);

router.post(
  "/invite",
  requirePermission("user.create"),
  validate(inviteAdminSchema, "body"),
  inviteAdminController
);

router.patch(
  "/:id/status",
  requirePermission("user.suspend"), 
  validate(userIdParamSchema, "params"),
  validate(updateUserStatusSchema, "body"),
  updateUserStatusController
);

router.patch(
  "/:id/system-role",
  requirePermission("user.edit"), 
  validate(userIdParamSchema, "params"),
  validate(updateSystemRoleSchema, "body"),
  updateUserRoleController
);

router.get(
  "/:id/functional-roles",
  requirePermission("user.view"),
  validate(userIdParamSchema, "params"),
  getUserFunctionalRolesController
);

router.post(
  "/:id/functional-roles",
  requirePermission("user.edit"), 
  validate(userIdParamSchema, "params"),
  validate(assignFunctionalRolesSchema, "body"),
  assignUserFunctionalRolesController
);


// Profile Details 
router.get(
  "/:id/details",
  requirePermission("user.view"),
  validate(userIdParamSchema, "params"),
  getUserDetailsController
);

// Force Logout (Revoke Sessions)
router.post(
  "/:id/revoke-sessions",
  requirePermission("user.suspend"),
  validate(userIdParamSchema, "params"),
  revokeSessionsController
);

// Cancel Pending Invitation
router.delete(
  "/invite/cancel",
  requirePermission("user.delete"), 
  cancelInviteController 
);

export default router;