import { Router } from "express";
import * as controller from "./faqs.controller.js";

const router = Router();

router.get("/", controller.getPublicFaqsController);

export default router;