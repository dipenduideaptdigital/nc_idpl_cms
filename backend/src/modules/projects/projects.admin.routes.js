import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import * as validation from "./projects.validation.js";
import * as controller from "./projects.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(validation.createProjectSchema, "body"), controller.createProjectController);
router.get("/", validate(validation.projectQuerySchema, "query"), controller.getAdminProjectsController);
router.get("/:id", validate(validation.projectIdParamSchema, "params"), controller.getAdminProjectByIdController);
router.patch("/:id", validate(validation.projectIdParamSchema, "params"), validate(validation.updateProjectSchema, "body"), controller.updateProjectController);
router.delete("/:id", validate(validation.projectIdParamSchema, "params"), controller.deleteProjectController);

export default router;