import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import usersAdminRoutes from "../modules/users/users.admin.routes.js";
import uploadsRoutes from "../modules/uploads/uploads.routes.js";
import cmsRoutes from "../modules/cms/cms.routes.js";
import pagesAdminRoutes from "../modules/pages/pages.admin.routes.js";
import pagesPublicRoutes from "../modules/pages/pages.public.routes.js";
import contactPublicRoutes from "../modules/contacts/contacts.public.routes.js";
import contactAdminRoutes from "../modules/contacts/contacts.admin.routes.js";
import contactFormsAdminRoutes from "../modules/contactForms/contactForms.admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin/users", usersAdminRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/cms", cmsRoutes);
router.use("/pages", pagesPublicRoutes);
router.use("/admin/pages", pagesAdminRoutes);
router.use("/contacts", contactPublicRoutes);
router.use("/admin", contactAdminRoutes);
router.use("/admin/contact-forms", contactFormsAdminRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;