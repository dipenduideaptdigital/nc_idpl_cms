import { prisma } from "../../config/db.js";

export const findFormById = async (id) => {
  return await prisma.contactForm.findUnique({ where: { id } });
};

export const findFormBySlug = async (slug) => {
  return await prisma.contactForm.findUnique({ where: { slug } });
};

export const persistFormNodeRecord = async (formData) => {
  return await prisma.contactForm.create({ data: formData });
};

export const updateFormNodeRecord = async (id, updateData) => {
  return await prisma.contactForm.update({ where: { id }, data: updateData });
};

export const hardDeleteFormEntityIfUnused = async (id) => {
  const submissionUsageCount = await prisma.contactSubmission.count({ where: { formId: id } });
  if (submissionUsageCount > 0) {
    return await prisma.contactForm.update({
      where: { id },
      data: { isActive: false }
    });
  }
  return await prisma.contactForm.delete({ where: { id } });
};

export const fetchAllFormsCollection = async () => {
  return await prisma.contactForm.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } }
  });
};