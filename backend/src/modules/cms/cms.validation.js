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
    useLogo: z.boolean().default(false).optional(),
    logoImage: z.string().optional().nullable(),
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
    copyrightText: z.string().max(255).optional(),
    privacyUrl: z.string().max(255).optional(),
    termsUrl: z.string().max(255).optional(),
    sitemapUrl: z.string().max(255).optional(),
    linksTitle1: z.string().max(100).optional(),
    linksTitle2: z.string().max(100).optional(),
    links1: z.array(z.object({ id: z.string().optional(), label: z.string().max(100).optional(), url: z.string().max(255).optional() })).optional(),
    links2: z.array(z.object({ id: z.string().optional(), label: z.string().max(100).optional(), url: z.string().max(255).optional() })).optional(),
    socialLinks: z.array(z.object({ id: z.string().optional(), label: z.string().max(100).optional(), url: z.string().max(255).optional() })).optional(),
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
    isVisible: z.boolean().optional(),
    titleLine1: z.string().max(150).optional(),
    titleLine2: z.string().max(150).optional(),
    subHeadline: z.string().max(200).optional(),
    italicWord: z.string().max(50).optional(),
    backgroundImage: z.string().optional(),
    features: z.array(z.object({
      icon: z.string().optional(),
      title: z.string().max(100).optional(),
      subtitle: z.string().max(100).optional(),
      titleBold: z.boolean().default(true).optional(),
    })).max(4).optional()
  })
});

export const ncMandalasSchema = z.object({
  content: z.object({
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
    plantImage: z.string().optional()
  })
});

export const ncServicesSchema = z.object({
  content: z.object({
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
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
    isVisible: z.boolean().optional(),
    titlePart1: z.string().optional(),
    titlePart2: z.string().optional(),
    headline: z.string().max(1000).optional(),
    subtext: z.string().max(1000).optional(),
    buttonText: z.string().max(50).optional(),
    buttonLink: z.string().max(200).optional(),
  })
});

export const gulmoHeroSchema = z.object({
  content: z.object({
    backgroundImage: z.string().optional()
  })
});

export const gulmoTerrariumSchema = z.object({
  content: z.object({
    mainJarImage: z.string().optional(),
    cat1Title: z.string().optional(),
    cat1Desc: z.string().max(1500).optional(),
    cat1Icon: z.string().optional(),
    cat2Title: z.string().optional(),
    cat2Desc: z.string().max(1500).optional(),
    cat2Icon: z.string().optional(),
    cat3Title: z.string().optional(),
    cat3Desc: z.string().max(1500).optional(),
    cat3Icon: z.string().optional(),
    bottomJar1: z.string().optional(),
    bottomJar2: z.string().optional(),
    bottomJar3: z.string().optional(),
    bottomJar4: z.string().optional(),
  })
});

export const gulmoQuoteSchema = z.object({
  content: z.object({
    bgImage: z.string().optional(),
    quoteIcon: z.string().optional(),
    quoteText: z.string().max(2000).optional(),
    quoteAuthor: z.string().max(150).optional()
  })
});

export const gulmoForestOrganismSchema = z.object({
  content: z.object({
    mainTitle: z.string().max(200).optional(),
    brushImage: z.string().optional(),
    jarImage: z.string().optional(),
    f1Label: z.string().optional(), f1Title: z.string().optional(), f1Desc: z.string().max(1000).optional(),
    f2Label: z.string().optional(), f2Title: z.string().optional(), f2Desc: z.string().max(1000).optional(),
    f3Label: z.string().optional(), f3Title: z.string().optional(), f3Desc: z.string().max(1000).optional(),
    f4Label: z.string().optional(), f4Sub: z.string().optional(), f4Title: z.string().optional(), f4Desc: z.string().max(1000).optional(),
    f5Label: z.string().optional(), f5Title: z.string().optional(), f5Desc: z.string().max(1000).optional(),
    f6Label: z.string().optional(), f6Sub: z.string().optional(), f6Title: z.string().optional(), f6Desc: z.string().max(1000).optional(),
  })
});

export const gulmoOurProjectsSchema = z.object({
  content: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),
    bgSplash: z.string().optional(),
    imageLeft: z.string().optional(),
    imageRight: z.string().optional()
  })
});

export const gulmoLetsBeginSchema = z.object({
  content: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),
    storeUrl: z.string().max(500).optional(),
    storeUrlText: z.string().max(150).optional(),
    btnText: z.string().max(100).optional(),
    imageMain: z.string().optional(),
    imageOverlay: z.string().optional()
  })
});

export const gulmoConceptSchema = z.object({
  content: z.object({
    studioName: z.string().max(150).optional(),
    mainTitle: z.string().max(250).optional(),
    description: z.string().max(2000).optional(),
    jarSectionTitle: z.string().max(150).optional(),
    jarSectionHeading: z.string().max(250).optional(),
    categories: z.array(
      z.object({
        id: z.string().optional(),
        label: z.string().optional(),
        desc: z.string().max(1000).optional(),
        img: z.string().optional()
      })
    ).optional(),
    galleryJars: z.array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        img: z.string().optional()
      })
    ).optional()
  })
});

export const contactRoutingSettingsSchema = z.object({
  content: z.object({
    successMessage: z.string().max(500).optional(),
    redirectUrl: z.string().max(500).optional().nullable(),
    notifyEmails: z.array(z.string().email()).optional(),
  })
});

export const ncContactPageSchema = z.object({
  content: z.object({
    assignedFormSlug: z.string().optional().nullable(),
    bannerTitle: z.string().optional(),
    bannerImage: z.string().optional(),
    contactHeading: z.string().optional(),
    contactSubtext: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    teamBannerImage: z.string().optional(),
    mapEmbedCode: z.string().max(3000).optional()
  }).catchall(z.any())
});

const baseMenuItemSchema = z.object({
  id: z.string().min(1, "Menu item ID is required"),
  label: z.string().trim().min(1, "Navigation label is required").max(100),
  type: z.enum(["custom", "page"], {
    errorMap: () => ({ message: "Link type must be 'custom' or 'page'" })
  }),
  url: z.string().trim().min(1, "URL is required").max(500),
});

const menuItemSchema = baseMenuItemSchema.extend({
  children: z.lazy(() => z.array(menuItemSchema)).default([])
});

export const headerMenuSchema = z.object({
  content: z.object({
    menuItems: z.array(menuItemSchema).default([])
  }).strict()
});