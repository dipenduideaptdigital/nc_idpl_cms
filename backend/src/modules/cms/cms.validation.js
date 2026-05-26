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

export const ourServicesSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    services: z.array(
      z.object({
        id: z.string().max(10),
        title: z.string().max(100),
      })
    ).max(6),
    stats: z.array(
      z.object({
        value: z.string().max(20),
        title: z.string().max(50),
        description: z.string().max(200),
      })
    ).max(4),
    image: z.string().optional().nullable(),
    bottomImage: z.string().optional().nullable(),
  }),
});

export const howWeWorkSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    steps: z.array(
      z.object({
        id: z.string().max(10),
        title: z.string().max(100),
        description: z.string().max(300),
      })
    ).max(4),
    bottomText: z.string().max(200),
    bottomLinkText: z.string().max(50),
    bottomLinkUrl: z.string().max(200),
  }),
});

export const ourProjectsSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    projects: z.array(
      z.object({
        id: z.union([z.number(), z.string()]),
        category: z.string().max(50),
        title: z.string().max(100),
        description: z.string().max(300),
        image: z.string().optional().nullable(),
      })
    ).max(5),
    bottomImage: z.string().optional().nullable(),
  }),
});

export const panoramasSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    image: z.string().optional().nullable(),
  }),
});

export const teamSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    image: z.string().optional().nullable(),
    members: z.array(
      z.object({
        id: z.string().max(10),
        name: z.string().max(100),
        role: z.string().max(100),
      })
    ).max(5),
  }),
});

export const testimonialsSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    description: z.string().max(500),
    image: z.string().optional().nullable(),
    ratingValue: z.string().max(10),
    reviewCount: z.string().max(20),
    conceptText: z.string().max(300),
    mainQuote: z.string().max(500),
    authorImage: z.string().optional().nullable(),
    authorName: z.string().max(100),
    authorRole: z.string().max(100),
    bottomText: z.string().max(200),
    logos: z.array(z.string().max(50)).max(5),
  }),
});

export const videoBannerSchema = z.object({
  content: z.object({
    videoId: z.string().max(50),
    image: z.string().optional().nullable(),
    title: z.string().max(150),
    description: z.string().max(500),
  }),
});

export const blogSectionSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(150),
    posts: z.array(
      z.object({
        id: z.union([z.number(), z.string()]),
        author: z.string().max(100),
        title: z.string().max(200),
        excerpt: z.string().max(400),
        image: z.string().optional().nullable(),
      })
    ).max(3),
  }),
});

export const gallerySchema = z.object({
  content: z.object({
    bgText: z.string().max(50),
    images: z.array(z.string()).max(6),
  }),
});

export const ctaSchema = z.object({
  content: z.object({
    badgeText: z.string().max(50),
    title: z.string().max(200),
    buttonText: z.string().max(50),
  }),
});