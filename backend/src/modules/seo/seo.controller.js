import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as seoService from "./seo.service.js";

const getBaseUrl = () => {
  return (process.env.CLIENT_URL || "https://subhaakritee.vercel.app").replace(/\/$/, "");
};

export const getRobotsTxt = asyncHandler(async (req, res) => {
  const content = seoService.generateRobotsTxt(getBaseUrl());
  // Improvement #7: Cache Control Added (1 Hour)
  res.set("Cache-Control", "public, max-age=3600");
  res.header("Content-Type", "text/plain");
  res.status(200).send(content);
});

export const getSitemapIndex = asyncHandler(async (req, res) => {
  const content = seoService.generateSitemapIndex(getBaseUrl());
  res.set("Cache-Control", "public, max-age=3600");
  res.header("Content-Type", "application/xml");
  res.status(200).send(content);
});

export const getPagesSitemap = asyncHandler(async (req, res) => {
  const content = await seoService.generatePagesSitemap(getBaseUrl());
  res.set("Cache-Control", "public, max-age=3600");
  res.header("Content-Type", "application/xml");
  res.status(200).send(content);
});

export const getBlogsSitemap = asyncHandler(async (req, res) => {
  const content = await seoService.generateBlogsSitemap(getBaseUrl());
  res.set("Cache-Control", "public, max-age=3600");
  res.header("Content-Type", "application/xml");
  res.status(200).send(content);
});