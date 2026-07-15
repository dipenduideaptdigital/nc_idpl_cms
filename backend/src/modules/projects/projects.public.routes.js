import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import * as validation from "./projects.validation.js";
import * as controller from "./projects.controller.js";

const router = Router();

router.get("/", validate(validation.projectQuerySchema, "query"), controller.getPublicProjectsController);
router.get("/:slug", validate(validation.projectSlugParamSchema, "params"), controller.getPublicProjectBySlugController);

export default router;