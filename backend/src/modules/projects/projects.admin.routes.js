import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requirePermission } from "../../shared/middlewares/permission.middleware.js"; 
import * as validation from "./projects.validation.js";
import * as controller from "./projects.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", requirePermission("project.create"), validate(validation.createProjectSchema, "body"), controller.createProjectController);
router.get("/", requirePermission("project.view"), validate(validation.projectQuerySchema, "query"), controller.getAdminProjectsController);
router.get("/:id", requirePermission("project.view"), validate(validation.projectIdParamSchema, "params"), controller.getAdminProjectByIdController);
router.patch("/:id", requirePermission("project.edit"), validate(validation.projectIdParamSchema, "params"), validate(validation.updateProjectSchema, "body"), controller.updateProjectController);
router.delete("/:id", requirePermission("project.delete"), validate(validation.projectIdParamSchema, "params"), controller.deleteProjectController);

export default router;