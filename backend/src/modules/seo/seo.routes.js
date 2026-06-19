import { Router } from "express";
import * as controller from "./seo.controller.js";

const router = Router();

router.get("/robots.txt", controller.getRobotsTxt);
router.get("/sitemap.xml", controller.getSitemapIndex);
router.get("/sitemap-pages.xml", controller.getPagesSitemap);
router.get("/sitemap-blogs.xml", controller.getBlogsSitemap);

export default router;