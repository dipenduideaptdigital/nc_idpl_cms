import { z } from "zod";

// Hardcoded blacklist metrics safeguarding ingestion engine from dirty mock payloads
export const RESERVED_SUBMISSION_EMAILS = [
  "test@test.com", 
  "spam@spam.com", 
  "admin@internal.local"
];

export const ALLOWED_CONTACT_STATUSES = [
  "NEW", 
  "IN_PROGRESS", 
  "RESOLVED", 
  "SPAM", 
  "ARCHIVED"
];

export const submitContactSchema = z.object({
  name: z.string().trim()
    .min(2, "Name field layout requires at least 2 characters")
    .max(100, "Name string parameter tracking length cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.\-]+$/, "Name syntax pattern contains unsupported threat injection payloads"),
    
  email: z.string().trim()
    .min(1, "Email field structure path parameter mapping is mandatory")
    .email("RFC architecture framework compliance validation check failed across email syntax lookups")
    .max(150, "Email length limit buffer exceeded safe data engine boundaries")
    .refine((email) => !RESERVED_SUBMISSION_EMAILS.includes(email), {
      message: "This operational logging email handle has been flagged or blacklisted by system security metrics.",
    }),
    
  phone: z.string().trim()
    .regex(/^[+]?[0-9\s.\-()]{7,20}$/, "Invalid structural telephone framework entry mapping validation failed")
    .optional()
    .nullable(),
    
  subject: z.string().trim()
    .max(200, "Subject header tracking matrix validation size boundary exceeded limit threshold")
    .optional()
    .nullable(),
    
  message: z.string().trim()
    .min(10, "Message content context configuration requires at least 10 description tracking tokens")
    .max(5000, "Payload input data buffer maximum threshold verification parameters alert triggers block"),
  
  // STRUCTURAL FORM SYSTEM LIFECYCLE SEPARATION KEY IDENTIFIER
  formId: z.string().cuid("Target operational Headless Form identity structural formatting verification error parameters mismatch constraint"),
    
  sourcePage: z.string().trim()
    .max(500, "Source URL path identifier string context is too long")
    .refine((path) => path.startsWith("/"), {
      message: "Resource routing allocation indicators can only accept safe, verified internal relative path variables (must start with '/'). Cross-origin target injection blocked."
    })
    .optional()
    .nullable(),
  //recaptchaToken: z.string().min(1, "Security validation protocol tracking token signature authentication validation required").optional()
  //turnstileToken: z.string().min(1, "Security validation protocol tracking token signature authentication validation required").optional()
}).strict();

export const updateContactStatusSchema = z.object({
  status: z.enum(ALLOWED_CONTACT_STATUSES, {
    errorMap: () => ({ message: "Target status transition state mapping parameter value is unrecognized inside system lifecycle architecture nodes." })
  }),
  note: z.string().trim()
    .max(1000, "Audit trail tracking logs remarks notes text context buffer length bounds failure warning check")
    .optional()
}).strict();

export const createInternalNoteSchema = z.object({
  note: z.string().trim()
    .min(1, "Internal administrative collaboration note context description text parameter mapping is mandatory")
    .max(2000, "Internal workspace description annotation notes boundary depth limit exceeded protection trigger check")
}).strict();

export const explicitRestorationReasonSchema = z.object({
  note: z.string().trim()
    .min(5, "Deliberate manual explicit lifecycle restoration override request requires an administrative tracking explanation note containing at least 5 character variables")
    .max(1000, "Restoration lifecycle trace audit comment description maximum threshold length constraint breached check")
}).strict();

export const contactQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page routing configuration lookup parameter index must be greater than 0").default(1),
  limit: z.coerce.number().int().min(1, "Pagination capacity constraint limit metrics parameter must be at least 1").max(100, "Maximum pagination buffer capacity allowed is 100 elements tracking bounds").default(10),
  search: z.string().trim().optional(),
  status: z.enum(ALLOWED_CONTACT_STATUSES).optional(),
  
  formId: z.string().cuid("Invalid layout filter matching target constraint identifier structural check mapping loops").optional(),
  
  startDate: z.string().datetime({ message: "Telemetry historical query timeline parameter filter requires a strictly compliant ISO-8601 datetime format snapshot data token" }).optional(),
  endDate: z.string().datetime({ message: "Telemetry historical query timeline parameter filter requires a strictly compliant ISO-8601 datetime format snapshot data token" }).optional(),
  sortBy: z.enum(["createdAt", "status", "name", "isViewed"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).strict();

export const contactParamSchema = z.object({
  id: z.string().cuid("Invalid lead operational lifecycle unique contextual identifier data trace relational engine mapping code verification mismatch")
});