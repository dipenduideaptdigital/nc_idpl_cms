import { z } from "zod";

// Registered system protection constraints
const RESERVED_SLUGS = [
  "admin", "api", "login", "register", "dashboard", 
  "cms", "uploads", "settings", "profile", "users",
  "home", "index", "404", "500", "menu"
];

// Dynamic system design layout templates routing blocks
export const ALLOWED_TEMPLATES = [
  "default",
  "landing-page",
  "service-page",
  "contact-page",
  "about-page"
];

const richTextBlockSchema = z.object({ type: z.literal("richText"), data: z.record(z.any()).default({}) });

const ripplesHeroBlockSchema = z.object({ type: z.literal("ripplesHero"), data: z.record(z.any()).default({}) });
const ripplesIntroBlockSchema = z.object({ type: z.literal("ripplesIntro"), data: z.record(z.any()).default({}) });
const ripplesNatureAquariumBlockSchema = z.object({ type: z.literal("ripplesNatureAquarium"), data: z.record(z.any()).default({}) });
const ripplesLetsBeginBlockSchema = z.object({ type: z.literal("ripplesLetsBegin"), data: z.record(z.any()).default({}) });
const ripplesAquascapeBlockSchema = z.object({ type: z.literal("ripplesAquascape"), data: z.record(z.any()).default({}) });
const getStartedCtaBlockSchema = z.object({ type: z.literal("getStartedCta"), data: z.record(z.any()).default({}) });

const contactFormBlockSchema = z.object({
  type: z.literal("contactForm"),
  data: z.object({
    formId: z.string().cuid("Block content specification failure: Dynamic rendering requires explicit reference binding to an active contact form engine database instance unique identity format signature."),
    formTitle: z.string().trim().max(100).optional().default("Get in Touch"),
    submitButtonText: z.string().trim().max(50).optional().default("Submit Inquiry"),
    redirectPath: z.string().trim().max(250).refine((path) => path.startsWith("/"), {
      message: "Success redirect target layout routing context must be a valid internal system relative path node string structure loop tracking pattern."
    }).optional()
  }).strict() 
});

const blockSchema = z.discriminatedUnion("type", [
  richTextBlockSchema,
  contactFormBlockSchema,
  ripplesHeroBlockSchema,
  ripplesIntroBlockSchema,
  ripplesNatureAquariumBlockSchema,
  ripplesLetsBeginBlockSchema,
  ripplesAquascapeBlockSchema,
  getStartedCtaBlockSchema,
]);

const pageContentSchema = z.object({
  blocks: z.array(blockSchema).default([]),
}).default({ blocks: [] });


// API Request Payload Validation Schemas
export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title cannot exceed 150 characters"),
  
  slug: z.string().trim().toLowerCase()
    .regex(/^[a-z0-9-\/]+$/, "Slug can only contain lowercase letters, numbers, dashes, and slashes")
    .max(150, "Slug cannot exceed 150 characters")
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "This slug is reserved by the system and cannot be used.",
    })
    .optional()
    .nullable(),
    
  excerpt: z.string().trim().max(1000, "Excerpt cannot exceed 1000 characters").optional().nullable(),
  content: pageContentSchema,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT").optional(),
  
  // Template Design Execution Hard Security Control
  template: z.enum(ALLOWED_TEMPLATES, {
    errorMap: () => ({ message: "Selected layout design template is not registered or supported by system." })
  }).default("default").optional(),

  parentId: z.string().cuid("Invalid Parent ID structural trace context format identifier").optional().nullable(),
  menuOrder: z.coerce.number().int("Menu display re-ordering parameter metrics must remain a valid integer").default(0).optional(),
  showInMenu: z.boolean().default(true).optional(),
  
  metaTitle: z.string().trim().max(100, "Meta title cannot exceed 100 characters").optional().nullable(),
  metaDescription: z.string().trim().max(500, "Meta description cannot exceed 500 characters").optional().nullable(),
  metaKeywords: z.string().trim().max(300, "Meta keywords cannot exceed 300 characters").optional().nullable(),
  
  featuredImageId: z.string().cuid("Invalid Media Asset digital asset cryptographic unique identity mapping").optional().nullable(),

  // SEO Engine Fields
  includeInSitemap: z.boolean().default(true).optional(),
  noIndex: z.boolean().default(false).optional(),
  noFollow: z.boolean().default(false).optional(),
  canonicalUrl: z.union([z.string().trim().url("Invalid canonical URL format."), z.literal("")]).optional().nullable(),
  ogTitle: z.string().trim().max(150).optional().nullable(),
  ogDescription: z.string().trim().max(500).optional().nullable(),
  ogImageId: z.union([z.string().cuid("Invalid OG Image ID format."), z.literal("")]).optional().nullable(),
}).strict();

// Core Update Operations Pipeline Matrix Verification Schema 
export const updatePageSchema = createPageSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// Admin Filter Matrix & Pagination Configuration Management Schema Lookups
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page tracking parameter must remain greater than 0").default(1),
  limit: z.coerce.number().int().min(1, "Pagination capacity constraint limit must register at least 1 data node").max(100, "Maximum network extraction block limit is capped at 100 records buffer").default(10),
  search: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  template: z.enum(ALLOWED_TEMPLATES).optional(), 
  authorId: z.string().cuid("Invalid corporate author query sequence filter constraint token").optional(),
  parentId: z.string().cuid("Invalid branch structural parent filter query identity token parameter").optional().nullable(), 
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title", "menuOrder"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const pageIdParamSchema = z.object({
  id: z.string().cuid("Invalid cryptographic database record or unique execution structural transaction identifier identity format mapped"),
});

export const pageSlugParamSchema = z.object({
  slug: z.string().min(1, "Absolute layout path relative network resource endpoint tracking resource tracking signature processing failed"),
});

export const pageRevisionParamSchema = z.object({
  id: z.string().cuid("Invalid relational Page context unique validation model master layout ID template mapping token"),
  revisionId: z.string().cuid("Invalid historical version revision database checkpoint identifier cryptographic targeted snapshot identity token format")
});