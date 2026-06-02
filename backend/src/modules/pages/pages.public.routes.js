import { Router } from "express";
import * as controller from "./pages.controller.js";

const router = Router();

router.get(
  "/menu", 
  controller.getPublicMenuTreeController
);

router.get(
  "/*", 
  controller.getPublicPageController
);

export default router;