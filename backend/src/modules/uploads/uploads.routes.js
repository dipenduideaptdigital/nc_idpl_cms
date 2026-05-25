import { Router } from "express";
import { uploadSingleImageController, uploadMultipleImagesController } from "./uploads.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { uploadImage } from "../../shared/middlewares/upload.middleware.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.post(
  "/image",
  uploadImage.single("image"),
  uploadSingleImageController
);

router.post(
  "/images",
  uploadImage.array("images", 5),
  uploadMultipleImagesController
);

export default router;