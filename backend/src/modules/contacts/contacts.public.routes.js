import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { submitContactSchema } from "./contacts.validation.js";
import * as controller from "./contacts.controller.js";

const router = Router();

router.post(
  "/submit",
  validate(submitContactSchema, "body"),
  controller.submitPublicContactFormController
);

export default router;