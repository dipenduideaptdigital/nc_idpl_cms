import { prisma } from "../../config/db.js";

export const create = async (data) => {
  return prisma.project.create({ data });
};

export const findAll = async ({ skip, take, where, orderBy }) => {
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { featuredImage: true, heroImage: true }
    }),
    prisma.project.count({ where })
  ]);
  return { projects, total };
};

export const findById = async (id) => {
  return prisma.project.findUnique({
    where: { id },
    include: { featuredImage: true, heroImage: true }
  });
};

export const findBySlug = async (slug) => {
  return prisma.project.findUnique({
    where: { slug },
    include: { featuredImage: true, heroImage: true }
  });
};

export const update = async (id, data) => {
  return prisma.project.update({
    where: { id },
    data
  });
};

export const deleteById = async (id) => {
  return prisma.project.delete({
    where: { id }
  });
};