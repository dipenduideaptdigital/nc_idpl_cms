import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { pageQuerySchema } from "./pages.validation.js";
import * as controller from "./pages.controller.js";

const router = Router();

router.get(
  "/",
  validate(pageQuerySchema, "query"),
  controller.getPublicPagesFlatCollectionController
);

router.get(
  "/menu", 
  controller.getPublicMenuTreeController
);

router.get(
  "/*", 
  controller.getPublicPageController
);

export default router;