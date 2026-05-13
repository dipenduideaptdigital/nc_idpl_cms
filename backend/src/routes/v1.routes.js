import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;