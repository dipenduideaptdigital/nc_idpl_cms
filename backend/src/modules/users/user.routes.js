import { Router } from "express";

import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";

import {
  authorizeSystemRoles,
  authorizePermissions,
} from "../../shared/middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/me",

  authenticate,

  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/admin-only",

  authenticate,

  authorizeSystemRoles(
    "SUPER_ADMIN",
    "ADMIN"
  ),

  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
    });
  }
);

router.get(
  "/manage-users",

  authenticate,

  authorizePermissions(
    "manage_users"
  ),

  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Permission-based access granted",
    });
  }
);

export default router;