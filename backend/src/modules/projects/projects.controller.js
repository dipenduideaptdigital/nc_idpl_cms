import * as service from "./projects.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";

// Admin Controllers
export const createProjectController = asyncHandler(async (req, res) => {
  const project = await service.createProject(req.body);
  return sendResponse({
    res,
    statusCode: 201,
    message: "Project created successfully",
    data: project
  });
});

export const getAdminProjectsController = asyncHandler(async (req, res) => {
  const result = await service.getProjects(req.query);
  return sendResponse({
    res,
    statusCode: 200,
    message: "Projects retrieved successfully",
    data: result.projects,
    meta: result.pagination
  });
});

export const getAdminProjectByIdController = asyncHandler(async (req, res) => {
  const project = await service.getProjectById(req.params.id);
  return sendResponse({
    res,
    statusCode: 200,
    message: "Project retrieved successfully",
    data: project
  });
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const project = await service.updateProject(req.params.id, req.body);
  return sendResponse({
    res,
    statusCode: 200,
    message: "Project updated successfully",
    data: project
  });
});

export const deleteProjectController = asyncHandler(async (req, res) => {
  await service.deleteProject(req.params.id);
  return sendResponse({
    res,
    statusCode: 200,
    message: "Project deleted successfully"
  });
});

// Public Controllers
export const getPublicProjectsController = asyncHandler(async (req, res) => {
  const query = { ...req.query, status: "PUBLISHED" };
  const result = await service.getProjects(query);
  return sendResponse({
    res,
    statusCode: 200,
    message: "Projects retrieved successfully",
    data: result.projects,
    meta: result.pagination
  });
});

export const getPublicProjectBySlugController = asyncHandler(async (req, res) => {
  const project = await service.getProjectBySlug(req.params.slug);
  
  if (project.status !== "PUBLISHED") {
    return sendResponse({
      res,
      statusCode: 404,
      success: false,
      message: "Project not found"
    });
  }

  return sendResponse({
    res,
    statusCode: 200,
    message: "Project retrieved successfully",
    data: project
  });
});