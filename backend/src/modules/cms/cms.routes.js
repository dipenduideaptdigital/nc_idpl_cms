import { Router } from "express";
import { getDynamicSectionController, updateDynamicSectionController, getMultipleDynamicSectionsController } from "./cms.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { dynamicCmsValidator } from "../../shared/middlewares/dynamicValidate.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";

const router = Router();

router.get("/sections", getMultipleDynamicSectionsController);
router.get("/section/:sectionKey", getDynamicSectionController);

router.use(authenticate, authorizeSystemRoles("SUPER_ADMIN", "ADMIN"));

router.put(
  "/section/:sectionKey", 
  (req, res, next) => req.params.sectionKey === "global_offerings_mega_menu"
    ? requirePermission("page.edit")(req, res, next)
    : next(),
  dynamicCmsValidator, 
  updateDynamicSectionController
);

export default router;