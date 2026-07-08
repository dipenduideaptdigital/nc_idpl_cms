import * as repository from "./projects.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js"; 
import { prisma } from "../../config/db.js";

// 👉 NOTUN: URL theke Media ID khunje ber korar function
const resolveImageId = async (imageUrlOrId) => {
  if (!imageUrlOrId || imageUrlOrId.trim() === "") return null;

  // Jodi eta already ID hoy (kon slash na thake), tahole direct return korbo
  if (!imageUrlOrId.includes("/")) return imageUrlOrId;

  try {
    // URL theke path tuku extract korchi search korar jonno
    let searchUrl = imageUrlOrId;
    if (searchUrl.startsWith("http")) {
      const urlObj = new URL(searchUrl);
      searchUrl = urlObj.pathname;
    }

    // Database e Media table e ei URL ta khunjchi
    const media = await prisma.media.findFirst({
      where: { url: searchUrl }
    });

    // Jodi peye jay tahole tar ID ta return korbo, nahole null
    return media ? media.id : null;
  } catch (error) {
    return null;
  }
};

export const createProject = async (data) => {
  let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
  
  const existing = await repository.findBySlug(slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  
  // 👉 FIX: URL pathale automatic ID te convert kore nebe
  data.featuredImageId = await resolveImageId(data.featuredImageId);
  
  return repository.create({ ...data, slug });
};

export const getProjects = async (query) => {
  const { page, limit, search, category, status, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (category && category !== 'All') where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
      { client: { contains: search } }
    ];
  }

  const orderBy = { [sortBy]: sortOrder };
  const { projects, total } = await repository.findAll({ skip, take: limit, where, orderBy });

  return {
    projects,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

export const getProjectById = async (id) => {
  const project = await repository.findById(id);
  if (!project) throw new AppError("Project not found", 404);
  return project;
};

export const getProjectBySlug = async (slug) => {
  const project = await repository.findBySlug(slug);
  if (!project) throw new AppError("Project not found", 404);
  return project;
};

export const updateProject = async (id, data) => {
  await getProjectById(id); // Check if exists

  if (data.slug) {
    data.slug = generateSlug(data.slug);
    const existing = await repository.findBySlug(data.slug);
    if (existing && existing.id !== id) {
      throw new AppError("This slug is already in use by another project", 400);
    }
  }

  // 👉 FIX: URL pathale automatic ID te convert kore nebe
  data.featuredImageId = await resolveImageId(data.featuredImageId);

  return repository.update(id, data);
};

export const deleteProject = async (id) => {
  await getProjectById(id); // Check if exists
  return repository.deleteById(id);
};