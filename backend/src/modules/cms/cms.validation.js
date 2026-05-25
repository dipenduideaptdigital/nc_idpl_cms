import { z } from "zod";

export const heroSchema = z.object({
  content: z.object({
    titleLine1: z.string().max(100),
    titleLine2: z.string().max(100),
    subtitle: z.string().max(500),
    buttonText: z.string().max(50),
    badgeText: z.string().max(50),
    glassCardNumber: z.string().max(20),
    glassCardText1: z.string().max(100),
    glassCardText2: z.string().max(100),
    backgroundImage: z.string().optional(),
    frontImage: z.string().optional(),
  }),
});

export const servicesSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    services: z.array(
      z.object({
        title: z.string().max(100),
        description: z.string().max(300),
      })
    ).max(4, "Maximum 4 services allowed"),
  }),
});

export const aboutSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    buttonText: z.string().max(50),
    image: z.string().optional(),
    highlights: z.array(z.string().max(100)).max(4),
  }),
});