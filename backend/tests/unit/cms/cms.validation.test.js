import { describe, it, expect } from "vitest";
import {
  generalSettingsSchema,
  cmsSettingsSchema,
  whatsappSettingsSchema,
  footerSchema,
  globalGeneralSettingsSchema,
  ncHeroSchema,
  ncMandalasSchema,
  ncLivingArtSchema,
  ncShowcaseSchema,
  ncPlantDisplaySchema,
  ncServicesSchema,
  ncPartnersSchema,
  ncBlogsSchema,
  ncWhatTheySaySchema,
  ncCtaSchema,
  gulmoHeroSchema,
  gulmoTerrariumSchema,
  gulmoQuoteSchema,
  gulmoForestOrganismSchema,
  gulmoOurProjectsSchema,
  gulmoLetsBeginSchema,
  gulmoConceptSchema,
  contactRoutingSettingsSchema,
  ncContactPageSchema,
  headerMenuSchema
} from "../../../src/modules/cms/cms.validation.js";

const strOfLen = (n) => "a".repeat(n);

const allSchemas = {
  generalSettingsSchema, cmsSettingsSchema, whatsappSettingsSchema, footerSchema, globalGeneralSettingsSchema,
  ncHeroSchema, ncMandalasSchema, ncLivingArtSchema, ncShowcaseSchema, ncPlantDisplaySchema, ncServicesSchema,
  ncPartnersSchema, ncBlogsSchema, ncWhatTheySaySchema, ncCtaSchema, gulmoHeroSchema, gulmoTerrariumSchema,
  gulmoQuoteSchema, gulmoForestOrganismSchema, gulmoOurProjectsSchema, gulmoLetsBeginSchema, gulmoConceptSchema,
  contactRoutingSettingsSchema, ncContactPageSchema, headerMenuSchema
};

describe("CMS Validation Schemas", () => {
  describe.each(Object.entries(allSchemas))("Common Tests for %s", (name, schema) => {
    it("CV-01: should accept minimal valid content { content: {} }", () => {
      const result = schema.safeParse({ content: {} });
      expect(result.success).toBe(true);
    });

    it("CV-02: should handle missing content appropriately", () => {
      const result = schema.safeParse({});
      if (name === "footerSchema") {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
      }
    });

    it("CV-03: should reject invalid content types", () => {
      expect(schema.safeParse({ content: null }).success).toBe(false);
      expect(schema.safeParse({ content: "invalid" }).success).toBe(false);
      expect(schema.safeParse({ content: [] }).success).toBe(false);
    });
  });

  describe("Important defaults and strictness", () => {
    it("preserves the homepage Mandala quote when saving CMS content", () => {
      const bottomQuote = "This eternal circle of life\nis playing constantly in\nand around us.";
      const parsed = ncMandalasSchema.parse({ content: { bottomQuote } });
      expect(parsed.content.bottomQuote).toBe(bottomQuote);
    });

    it("CV-04: generalSettingsSchema specific rules", () => {
      const parsed = generalSettingsSchema.parse({ content: {} });
      expect(parsed.content.landingPage).toBe("default");

      // Valid enum values
      expect(generalSettingsSchema.safeParse({ content: { landingPage: "reference" } }).success).toBe(true);
      
      // Rejects invalid enum & strict content block
      expect(generalSettingsSchema.safeParse({ content: { landingPage: "custom" } }).success).toBe(false);
      expect(generalSettingsSchema.safeParse({ content: { unknownField: true } }).success).toBe(false);
    });

    it("CV-05: whatsappSettingsSchema specific rules", () => {
      const parsed = whatsappSettingsSchema.parse({ content: {} });
      expect(parsed.content.isActive).toBe(true);

      expect(whatsappSettingsSchema.safeParse({ content: { isActive: false } }).success).toBe(true);
      expect(whatsappSettingsSchema.safeParse({ content: { isActive: "true" } }).success).toBe(false);
    });

    it("CV-06: headerMenuSchema specific rules & deeply nested arrays", () => {
      const parsed = headerMenuSchema.parse({ content: {} });
      expect(parsed.content.menuItems).toEqual([]);

      const validPayload = {
        content: {
          menuItems: [{ id: "1", label: "Home", type: "page", url: "/home" }]
        }
      };
      const parsedValid = headerMenuSchema.parse(validPayload);
      expect(parsedValid.content.menuItems[0].children).toEqual([]);

      const paddedPayload = {
        content: {
          menuItems: [{ id: " id_2 ", label: " Menu ", type: "custom", url: " /link " }]
        }
      };
      const parsedPadded = headerMenuSchema.parse(paddedPayload);
      expect(parsedPadded.content.menuItems[0].label).toBe("Menu");
      expect(parsedPadded.content.menuItems[0].url).toBe("/link");
      expect(parsedPadded.content.menuItems[0].id).toBe(" id_2 ");

      // Required fields & valid types
      expect(headerMenuSchema.safeParse({ content: { menuItems: [{ id: "", label: "", type: "custom", url: "" }] } }).success).toBe(false);
      expect(headerMenuSchema.safeParse({ content: { menuItems: [{ id: "1", label: "L", type: "invalid", url: "/u" }] } }).success).toBe(false);

      // Boundary tests
      expect(headerMenuSchema.safeParse({ content: { menuItems: [{ id: "1", label: strOfLen(100), type: "page", url: "/u" }] } }).success).toBe(true);
      expect(headerMenuSchema.safeParse({ content: { menuItems: [{ id: "1", label: strOfLen(101), type: "page", url: "/u" }] } }).success).toBe(false);
      expect(headerMenuSchema.safeParse({ content: { menuItems: [{ id: "1", label: "A", type: "page", url: strOfLen(501) }] } }).success).toBe(false);
    });

    it("CV-07: defaults and optional combinations resolve predictably", () => {
      const cmsParsed = cmsSettingsSchema.parse({ content: {} });
      expect(cmsParsed.content.useLogo).toBe(false);

      const heroParsed = ncHeroSchema.parse({ content: { features: [{}] } });
      expect(heroParsed.content.features[0].titleBold).toBe(true);
    });
  });
  
  describe("Nature Cube Array Boundaries", () => {
    it("ncHeroSchema should enforce max 4 features", () => {
      const feature = { title: "A" };
      expect(ncHeroSchema.safeParse({ content: { features: Array(4).fill(feature) } }).success).toBe(true);
      expect(ncHeroSchema.safeParse({ content: { features: Array(5).fill(feature) } }).success).toBe(false);
    });

    it("ncShowcaseSchema should enforce max 3 gallery images and valid strings", () => {
      expect(ncShowcaseSchema.safeParse({ content: { galleryImages: ["img1", "img2", "img3"] } }).success).toBe(true);
      expect(ncShowcaseSchema.safeParse({ content: { galleryImages: ["img1", "img2", "img3", "img4"] } }).success).toBe(false);
      expect(ncShowcaseSchema.safeParse({ content: { galleryImages: [123] } }).success).toBe(false);
    });

    it("ncPartnersSchema should enforce max 8 partner logos", () => {
      expect(ncPartnersSchema.safeParse({ content: { partnerLogos: Array(8).fill("logo") } }).success).toBe(true);
      expect(ncPartnersSchema.safeParse({ content: { partnerLogos: Array(9).fill("logo") } }).success).toBe(false);
    });

    it("ncBlogsSchema should enforce max 4 cards", () => {
      expect(ncBlogsSchema.safeParse({ content: { cards: Array(4).fill({ title: "T" }) } }).success).toBe(true);
      expect(ncBlogsSchema.safeParse({ content: { cards: Array(5).fill({ title: "T" }) } }).success).toBe(false);
    });
  });

  describe("String & Logic Constraints", () => {
    it("footerSchema string length limits", () => {
      expect(footerSchema.safeParse({ content: { linksTitle1: strOfLen(100) } }).success).toBe(true);
      expect(footerSchema.safeParse({ content: { linksTitle1: strOfLen(101) } }).success).toBe(false);
    });

    it("contactRoutingSettingsSchema email arrays & url limits", () => {
      expect(contactRoutingSettingsSchema.safeParse({ content: { notifyEmails: ["valid@test.com"] } }).success).toBe(true);
      expect(contactRoutingSettingsSchema.safeParse({ content: { notifyEmails: [] } }).success).toBe(true);
      expect(contactRoutingSettingsSchema.safeParse({ content: { notifyEmails: ["invalid-email"] } }).success).toBe(false);
      expect(contactRoutingSettingsSchema.safeParse({ content: { redirectUrl: strOfLen(500) } }).success).toBe(true);
      expect(contactRoutingSettingsSchema.safeParse({ content: { redirectUrl: strOfLen(501) } }).success).toBe(false);
    });

    it("ncContactPageSchema should preserve unknown properties (catchall)", () => {
      const payload = {
        content: {
          assignedFormSlug: "contact-form",
          unknownPropertyWeDidNotDefine: "This should be preserved"
        }
      };
      const parsed = ncContactPageSchema.parse(payload);
      expect(parsed.content.unknownPropertyWeDidNotDefine).toBe("This should be preserved");
    });

    it("globalGeneralSettingsSchema supportEmail behavior", () => {
      expect(globalGeneralSettingsSchema.safeParse({ content: { supportEmail: "admin@test.com" } }).success).toBe(true);
      expect(globalGeneralSettingsSchema.safeParse({ content: { supportEmail: "" } }).success).toBe(true);
      expect(globalGeneralSettingsSchema.safeParse({ content: { supportEmail: "bad-email" } }).success).toBe(false);
    });
  });
});
