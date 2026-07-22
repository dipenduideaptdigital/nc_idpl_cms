import { Router } from "express";
import { 
  uploadSingleImageController, 
  uploadMultipleImagesController,
  getAllMediaController,
  getMediaByIdController,
  deleteMediaController
} from "./uploads.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { uploadImage } from "../../shared/middlewares/upload.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";

const router = Router();

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

// Get Media Library
router.get("/", requirePermission("media.view"), getAllMediaController);
router.get("/:id", requirePermission("media.view"), getMediaByIdController);

// Upload Media
router.post(
  "/image",
  requirePermission("media.upload"),
  uploadImage.single("image"),
  uploadSingleImageController
);

router.post(
  "/images",
  requirePermission("media.upload"),
  uploadImage.array("images", 5),
  uploadMultipleImagesController
);

router.delete("/:id", requirePermission("media.delete"), deleteMediaController);

export default router;