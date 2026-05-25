import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import usersAdminRoutes from "../modules/users/users.admin.routes.js";
import uploadsRoutes from "../modules/uploads/uploads.routes.js";
import cmsRoutes from "../modules/cms/cms.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin/users", usersAdminRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/cms", cmsRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;