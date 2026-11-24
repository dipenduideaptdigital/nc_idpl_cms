import { Router } from "express";

import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { authorizeSystemRoles } from "../../shared/middlewares/authorize.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

import * as val from "./faqs.validation.js";
import * as controller from "./faqs.controller.js";

const router = Router();

router.use(
  authenticate,
  authorizeSystemRoles("SUPER_ADMIN", "ADMIN")
);

// Categories

router.get(
  "/categories",
  requirePermission("faq.view"),
  controller.getAdminCategoriesController
);

router.post(
  "/categories",
  requirePermission("faq.create"),
  validate(val.createFaqCategorySchema, "body"),
  controller.createCategoryController
);

router.patch(
  "/categories/:id",
  requirePermission("faq.edit"),
  validate(val.faqParamSchema, "params"),
  validate(val.updateFaqCategorySchema, "body"),
  controller.updateCategoryController
);

router.delete(
  "/categories/:id",
  requirePermission("faq.delete"),
  validate(val.faqParamSchema, "params"),
  controller.deleteCategoryController
);

// Questions

router.get(
  "/questions",
  requirePermission("faq.view"),
  controller.getAdminQuestionsController
);

router.post(
  "/questions",
  requirePermission("faq.create"),
  validate(val.createFaqQuestionSchema, "body"),
  controller.createQuestionController
);

router.patch(
  "/questions/:id",
  requirePermission("faq.edit"),
  validate(val.faqParamSchema, "params"),
  validate(val.updateFaqQuestionSchema, "body"),
  controller.updateQuestionController
);

router.delete(
  "/questions/:id",
  requirePermission("faq.delete"),
  validate(val.faqParamSchema, "params"),
  controller.deleteQuestionController
);

// Reorder

router.patch(
  "/reorder",
  requirePermission("faq.edit"),
  validate(val.reorderSchema, "body"),
  controller.reorderController
);

export default router;