import { Router } from "express";
import { getDynamicSectionController, updateDynamicSectionController } from "./cms.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { dynamicCmsValidator } from "../../shared/middlewares/dynamicValidate.middleware.js";

const router = Router();

router.get("/section/:sectionKey", getDynamicSectionController);

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.put(
  "/section/:sectionKey", 
  dynamicCmsValidator, 
  updateDynamicSectionController
);

export default router;