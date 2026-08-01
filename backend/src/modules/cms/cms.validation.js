import { z } from "zod";

// General Settings Section
export const generalSettingsSchema = z.object({
  content: z.object({
    landingPage: z.enum(["default", "reference"]).default("default")
  }).strict()
});

// CMS Settings Section
export const cmsSettingsSchema = z.object({
  content: z.object({
    cmsName: z.string().max(100).optional(),
    cmsTagline: z.string().max(200).optional(),
  })
});

// WhatsApp Settings Section
export const whatsappSettingsSchema = z.object({
  content: z.object({
    phoneNumber: z.string().max(50).optional(),
    defaultMessage: z.string().max(300).optional(),
    isActive: z.boolean().default(true),
  })
});

// Footer Section
export const footerSchema = z.object({
  content: z.object({
    description: z.string().max(1000).optional(),
    address: z.string().max(500).optional(),
    phone: z.string().max(100).optional(),
    phone2: z.string().max(100).optional(),
    email: z.string().max(100).optional(),
    email2: z.string().max(100).optional(),
    instagram: z.string().max(255).optional(),
    twitter: z.string().max(255).optional(),
    facebook: z.string().max(255).optional(),
    linkedin: z.string().max(255).optional(),
    copyrightText: z.string().max(255).optional(),
    linksTitle1: z.string().max(100).optional(),
    linksTitle2: z.string().max(100).optional(),
    links1: z.array(
      z.object({
        label: z.string().max(100).optional(),
        url: z.string().max(255).optional(),
      })
    ).optional(),
    links2: z.array(
      z.object({
        label: z.string().max(100).optional(),
        url: z.string().max(255).optional(),
      })
    ).optional(),
  }).optional(),
});

export const globalGeneralSettingsSchema = z.object({
  content: z.object({
    websiteName: z.string().max(100).optional(),
    supportEmail: z.string().email().optional().or(z.literal('')),
    faviconImage: z.string().optional().nullable(),
    adminLoginLogo: z.string().optional().nullable(),
    errorPageImage: z.string().optional().nullable(),
    errorPageTitle: z.string().max(150).optional(),
    errorPageDescription: z.string().max(500).optional(),
    errorPageButtonText: z.string().max(50).optional(),
    showBackToTop: z.union([z.boolean(), z.string()]).optional(),
  })
});

// NATURE CUBE SCHEMAS

export const ncHeroSchema = z.object({
  content: z.object({
    titleLine1: z.string().max(150).optional(),
    titleLine2: z.string().max(150).optional(),
    subHeadline: z.string().max(200).optional(),
    italicWord: z.string().max(50).optional(),
    backgroundImage: z.string().optional(),
  })
});

export const ncMandalasSchema = z.object({
  content: z.object({
    tagline: z.string().max(100).optional(),
    mainTitle: z.string().max(150).optional(),
    headingLine1: z.string().max(150).optional(),
    headingLine2: z.string().max(150).optional(),
    italicWord: z.string().max(50).optional(),
    descLine1: z.string().max(200).optional(),
    descLine2: z.string().max(200).optional(),
    buttonText: z.string().max(100).optional(),
    mandalaImage: z.string().optional(),
  })
});

export const ncLivingArtSchema = z.object({
  content: z.object({
    tagline: z.string().max(100).optional(),
    mainTitle: z.string().max(100).optional(),
    italicTitle: z.string().max(50).optional(),
    subHeadline: z.string().max(300).optional(),
    paragraph: z.string().max(1000).optional(),
    videoUrl: z.string().max(500).optional(),
    tabs: z.array(
      z.object({
        id: z.string().max(10).optional(),
        title: z.string().max(100).optional(),
        desc1: z.string().max(500).optional(),
        desc2: z.string().max(500).optional(),
        image: z.string().optional(),
      })
    ).optional(),
    footerTagline: z.string().max(100).optional(),
    footerQuote: z.string().max(500).optional(),
  })
});

export const ncShowcaseSchema = z.object({
  content: z.object({
    row1Logo: z.string().optional(),
    row1Desc: z.string().max(1000).optional(),
    galleryImages: z.array(z.string()).max(3).optional(),
    
    row2Logo: z.string().optional(),
    row2Desc: z.string().max(1000).optional(),
    row2BtnText: z.string().max(50).optional(),
    row2FloatingImg: z.string().optional(),
    
    row3Logo: z.string().optional(),
    row3Desc: z.string().max(1000).optional(),
    row3BtnText: z.string().max(50).optional(),
    row3FloatingImg: z.string().optional(),
  })
});

export const ncPlantDisplaySchema = z.object({
  content: z.object({
    plantImage: z.string().optional()
  })
});

export const ncServicesSchema = z.object({
  content: z.object({
    tagline: z.string().optional(),
    headline: z.string().max(1000).optional(),
    subtext: z.string().max(1000).optional(),
    services: z.array(z.object({
      number: z.string().optional(),
      title: z.string().optional(),
      description: z.string().max(2000).optional(),
      image: z.string().optional()
    })).optional()
  })
});

export const ncPartnersSchema = z.object({
  content: z.object({
    mainTitle1: z.string().optional(),
    italicTitle: z.string().optional(),
    headline: z.string().max(1000).optional(),
    paragraph: z.string().max(2000).optional(),
    buttonText: z.string().max(50).optional(),
    buttonLink: z.string().optional(),
    partnerLogos: z.array(z.string()).max(8).optional(), 
  })
});

export const ncBlogsSchema = z.object({
  content: z.object({
    tagline: z.string().optional(),
    mainTitle: z.string().optional(),
    italicTitle: z.string().optional(),
    subText: z.string().max(1000).optional(),
    headline: z.string().max(1000).optional(),
    cards: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().max(1000).optional(),
        image: z.string().optional()
      })
    ).max(4).optional()
  })
});

export const ncWhatTheySaySchema = z.object({
  content: z.object({
    tagline: z.string().max(100).optional(),
    titlePrefix: z.string().max(100).optional(),
    italicTitle: z.string().max(100).optional(),
    headline: z.string().max(1000).optional(),
    testimonials: z.array(
      z.object({
        name: z.string().max(100).optional(),
        location: z.string().max(100).optional(),
        comment: z.string().max(2000).optional(),
        image: z.string().optional()
      })
    ).optional()
  })
});

export const ncCtaSchema = z.object({
  content: z.object({
    titlePart1: z.string().optional(),
    titlePart2: z.string().optional(),
    headline: z.string().max(1000).optional(),
    subtext: z.string().max(1000).optional(),
    buttonText: z.string().max(50).optional(),
    buttonLink: z.string().max(200).optional(),
  })
});