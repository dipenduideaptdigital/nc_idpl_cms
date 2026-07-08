import * as repository from "./projects.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { generateSlug } from "../../shared/utils/slugify.js"; 

export const createProject = async (data) => {
  // slugify er jaygay generateSlug use kora holo
  let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
  
  const existing = await repository.findBySlug(slug);
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }
  
  // 👉 FIX: Prisma foreign key error atkate empty image ID ke null kora holo
  if (!data.featuredImageId || data.featuredImageId.trim() === "") {
    data.featuredImageId = null;
  }
  
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
    // Ekhaneo generateSlug use kora holo
    data.slug = generateSlug(data.slug);
    const existing = await repository.findBySlug(data.slug);
    if (existing && existing.id !== id) {
      throw new AppError("This slug is already in use by another project", 400);
    }
  }

  // 👉 FIX: Ekhaneo same fix add kora holo (Update er somoy)
  if (!data.featuredImageId || data.featuredImageId.trim() === "") {
    data.featuredImageId = null;
  }

  return repository.update(id, data);
};

export const deleteProject = async (id) => {
  await getProjectById(id);
  return repository.deleteById(id);
};