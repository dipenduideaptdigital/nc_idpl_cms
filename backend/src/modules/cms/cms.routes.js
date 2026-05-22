import { Router } from "express";
import { getHomePageSetting, updateHomePageSetting, uploadImage } from "./cms.controller.js";
import { upload } from "../../shared/middlewares/upload.middleware.js";

const router = Router();

// Public routes for fetching homepage data
router.get("/homepage/:section", getHomePageSetting);

// Protected routes (Admin only) - skipping auth middleware for this MVP/prototype as requested
router.put("/homepage/:section", updateHomePageSetting);

// Upload endpoint
router.post("/upload", upload.single("image"), uploadImage);

export default router;