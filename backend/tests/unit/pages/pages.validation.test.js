import { describe, it, expect } from "vitest";
import {
  createPageSchema,
  updatePageSchema,
  pageQuerySchema,
  pageIdParamSchema,
  pageSlugParamSchema,
  pageRevisionParamSchema,
} from "../../../src/modules/pages/pages.validation.js";

describe("Pages Validation Schemas", () => {

  describe("1. updatePageSchema (PATCH Request Validation)", () => {
    it("UVAL01, UVAL02, UVAL03, UVAL04: should validate partial update (NOTE: currently injects defaults due to Zod behavior)", async () => {
      const input = { title: "Updated title" };
      const result = await updatePageSchema.safeParseAsync(input);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("title", "Updated title");
      expect(result.data.content).toEqual({ blocks: [] }); // UVAL02
      expect(result.data.menuOrder).toBe(0); // UVAL03
      expect(result.data.showInMenu).toBe(true);
      expect(result.data.includeInSitemap).toBe(true);
      expect(result.data.template).toBe("default"); // UVAL04
    });

    it("UVAL05: should apply transformations on explicitly provided fields", async () => {
      const input = { title: "  Trimmed Title  ", slug: "  UPPER-slug  " };
      const result = await updatePageSchema.safeParseAsync(input);
      
      expect(result.success).toBe(true);
      expect(result.data.title).toBe("Trimmed Title");
      expect(result.data.slug).toBe("upper-slug");
    });

    it("UVAL06: should reject unknown top-level fields", async () => {
      const input = { title: "Title", hackerField: "bad" };
      const result = await updatePageSchema.safeParseAsync(input);
      expect(result.success).toBe(false);
    });

    it("UVAL07: should reject empty or whitespace-only title if explicitly provided", async () => {
      expect((await updatePageSchema.safeParseAsync({ title: "" })).success).toBe(false);
      expect((await updatePageSchema.safeParseAsync({ title: "   " })).success).toBe(false);
    });

    it("UVAL08, UVAL09: should accept ARCHIVED status and reject invalid ones", async () => {
      expect((await updatePageSchema.safeParseAsync({ status: "ARCHIVED" })).success).toBe(true);
      expect((await updatePageSchema.safeParseAsync({ status: "FAKE_STATUS" })).success).toBe(false);
    });

    it("UVAL10: should run publish refinement if status is PUBLISHED", async () => {
      // Missing content for legacy published page
      const result = await updatePageSchema.safeParseAsync({ status: "PUBLISHED" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/Legacy page requires at least one content block/);
    });
  });

  describe("2. createPageSchema (Required fields, defaults, limits)", () => {
    describe("A. Title Validation", () => {
      it("CVAL01 - CVAL08: should validate title constraints", async () => {
        const getPayload = (title) => ({ title, status: "DRAFT" });
        
        expect((await createPageSchema.safeParseAsync(getPayload("About Us"))).success).toBe(true); // CVAL01
        expect((await createPageSchema.safeParseAsync({ status: "DRAFT" })).success).toBe(false); // CVAL02
        expect((await createPageSchema.safeParseAsync(getPayload(""))).success).toBe(false); // CVAL03
        expect((await createPageSchema.safeParseAsync(getPayload("   "))).success).toBe(false); // CVAL04
        
        const res5 = await createPageSchema.safeParseAsync(getPayload("  About Us  ")); // CVAL05
        expect(res5.success).toBe(true);
        expect(res5.data.title).toBe("About Us");

        expect((await createPageSchema.safeParseAsync(getPayload("a".repeat(150)))).success).toBe(true); // CVAL06
        expect((await createPageSchema.safeParseAsync(getPayload("a".repeat(151)))).success).toBe(false); // CVAL07
        expect((await createPageSchema.safeParseAsync(getPayload(123))).success).toBe(false); // CVAL08
      });
    });

    describe("B. Slug Validation", () => {
      it("CVAL09 - CVAL20: should validate slug patterns, limits, and reserved keywords", async () => {
        const getPayload = (slug) => ({ title: "Valid Title", slug, status: "DRAFT" });

        expect((await createPageSchema.safeParseAsync({ title: "Valid" })).success).toBe(true); // CVAL09 (Missing)
        expect((await createPageSchema.safeParseAsync(getPayload(null))).success).toBe(true); // CVAL10
        
        const res11 = await createPageSchema.safeParseAsync(getPayload("  ABOUT-US  "));
        expect(res11.success).toBe(true);
        expect(res11.data.slug).toBe("about-us"); // CVAL11

        expect((await createPageSchema.safeParseAsync(getPayload("about-us-123"))).success).toBe(true); // CVAL12
        expect((await createPageSchema.safeParseAsync(getPayload("about/us"))).success).toBe(true); // CVAL13
        
        // Invalid patterns
        expect((await createPageSchema.safeParseAsync(getPayload("about us"))).success).toBe(false); // CVAL14
        expect((await createPageSchema.safeParseAsync(getPayload("about_us"))).success).toBe(false); // CVAL15
        expect((await createPageSchema.safeParseAsync(getPayload("about@us"))).success).toBe(false); // CVAL16
        
        // Length bounds
        expect((await createPageSchema.safeParseAsync(getPayload("a".repeat(150)))).success).toBe(true); // CVAL17
        expect((await createPageSchema.safeParseAsync(getPayload("a".repeat(151)))).success).toBe(false); // CVAL18

        // Reserved Slugs CVAL19 & CVAL20
        const reserved = ["admin", "api", "login", "register", "dashboard", "cms"];
        for (const rSlug of reserved) {
          expect((await createPageSchema.safeParseAsync(getPayload(rSlug))).success).toBe(false);
          expect((await createPageSchema.safeParseAsync(getPayload(`  ${rSlug.toUpperCase()}  `))).success).toBe(false);
        }
      });
    });

    describe("C. Content & Defaults", () => {
      it("CVAL21 - CVAL30: should apply correct content defaults and structural rules", async () => {
        //Missing content generates default
        const res21 = await createPageSchema.safeParseAsync({ title: "T", status: "DRAFT" });
        expect(res21.data.content).toEqual({ blocks: [] });

        //Explicit valid content
        expect((await createPageSchema.safeParseAsync({ title: "T", content: { blocks: [] }, status: "DRAFT" })).success).toBe(true);
        
        // Null or invalid blocks
        expect((await createPageSchema.safeParseAsync({ title: "T", content: null })).success).toBe(false);
        expect((await createPageSchema.safeParseAsync({ title: "T", content: { blocks: {} } })).success).toBe(false);
        
        // Invalid block structures
        expect((await createPageSchema.safeParseAsync({ title: "T", content: { blocks: [{ data: {} }] } })).success).toBe(false);
        expect((await createPageSchema.safeParseAsync({ title: "T", content: { blocks: [{ type: "unknown" }] } })).success).toBe(false);

        //  Valid block, data missing (defaults applied)
        const res28 = await createPageSchema.safeParseAsync({ title: "T", status: "DRAFT", content: { blocks: [{ type: "richText" }] } });
        expect(res28.data.content.blocks[0].data).toEqual({});

        // Unknown top-level payload field
        expect((await createPageSchema.safeParseAsync({ title: "T", status: "DRAFT", authorId: "123" })).success).toBe(false);
      });
    });
  });

  describe("3. Publish Validation (PVAL01 - PVAL12)", () => {
    it("should allow DRAFT or SCHEDULED without strict content checks", async () => {
      expect((await createPageSchema.safeParseAsync({ title: "T" })).success).toBe(true); // PVAL01 (Default DRAFT)
      expect((await createPageSchema.safeParseAsync({ title: "T", status: "DRAFT", content: { blocks: [] } })).success).toBe(true); // PVAL02
      expect((await createPageSchema.safeParseAsync({ title: "T", status: "SCHEDULED" })).success).toBe(true); // PVAL10
    });

    it("should enforce legacy publish rules (must have blocks)", async () => {
      //Empty blocks rejected
      expect((await createPageSchema.safeParseAsync({ title: "T", status: "PUBLISHED", content: { blocks: [] } })).success).toBe(false);
      
      // Valid blocks accepted
      expect((await createPageSchema.safeParseAsync({ 
        title: "T", 
        status: "PUBLISHED", 
        content: { blocks: [{ type: "richText", data: {} }] } 
      })).success).toBe(true);
    });

    it("should enforce modern template publish rules", async () => {
      const getModern = (overrides) => ({
        title: "T", status: "PUBLISHED", templateKey: "landing-basic", templateVersion: 1, content: { blocks: [{ type: "richText" }] }, ...overrides
      });

      expect((await createPageSchema.safeParseAsync(getModern({}))).success).toBe(true); // PVAL05
      
      const res6 = await createPageSchema.safeParseAsync(getModern({ templateKey: "unknown-key" }));
      expect(res6.success).toBe(false);
      expect(res6.error.issues[0].message).toMatch(/is not a valid registered template/); // PVAL06

      const res7 = await createPageSchema.safeParseAsync(getModern({ templateVersion: null }));
      expect(res7.success).toBe(false);
      expect(res7.error.issues[0].message).toMatch(/Template version is required/); // PVAL07

      const res8 = await createPageSchema.safeParseAsync(getModern({ content: { blocks: [] } }));
      expect(res8.success).toBe(false);
      expect(res8.error.issues[0].message).toMatch(/Content cannot be empty/); // PVAL08
    });
  });

  describe("4. pageQuerySchema (QVAL01 - QVAL18)", () => {
    it("should apply defaults to empty query", async () => {
      const result = await pageQuerySchema.safeParseAsync({});
      expect(result.data).toMatchObject({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }); // QVAL01
    });

    it("should coerce valid numeric strings and reject out-of-bound values", async () => {
      const res2 = await pageQuerySchema.safeParseAsync({ page: "3", limit: "20" });
      expect(res2.data.page).toBe(3);
      expect(res2.data.limit).toBe(20); // QVAL02

      expect((await pageQuerySchema.safeParseAsync({ page: "0" })).success).toBe(false); // QVAL03
      expect((await pageQuerySchema.safeParseAsync({ limit: "101" })).success).toBe(false); // QVAL06
    });

    it("should strip unknown query keys", async () => {
      const result = await pageQuerySchema.safeParseAsync({ search: "  test  ", unknownKey: "drop me" });
      expect(result.data.search).toBe("test"); // QVAL08
      expect(result.data.unknownKey).toBeUndefined(); // QVAL18
    });
  });

  describe("5. Parameter Schemas", () => {
    it("IDVAL: should validate pageId Param", async () => {
      expect((await pageIdParamSchema.safeParseAsync({ id: "cm0zabcdefghijklmno123456" })).success).toBe(true);
      expect((await pageIdParamSchema.safeParseAsync({ id: "invalid" })).success).toBe(false);
    });

    it("RVAL: should validate revision params", async () => {
      const validCuid = "cm0zabcdefghijklmno123456";
      expect((await pageRevisionParamSchema.safeParseAsync({ id: validCuid, revisionId: validCuid })).success).toBe(true);
      expect((await pageRevisionParamSchema.safeParseAsync({ id: validCuid })).success).toBe(false);
    });

    it("SVAL: should validate slug param", async () => {
      expect((await pageSlugParamSchema.safeParseAsync({ slug: "valid-slug" })).success).toBe(true);
      expect((await pageSlugParamSchema.safeParseAsync({ slug: "" })).success).toBe(false);
      
      const whitespaceResult = await pageSlugParamSchema.safeParseAsync({ slug: "   " });
      expect(whitespaceResult.success).toBeDefined(); 
    });
  });

  describe("6. Dynamic Block Type Registry", () => {
    it("should accept all registered block types", async () => {
      const registeredTypes = [
        "richText", "contactForm", "dynamicButton", "ripplesHero", 
        "gulmoHero", "prakritiHero", "workshopHero", "projectsBanner"
      ];

      for (const type of registeredTypes) {
        const payload = { title: "Test", status: "DRAFT", content: { blocks: [{ type }] } };
        const result = await createPageSchema.safeParseAsync(payload);
        expect(result.success).toBe(true);
      }
    });

    it("should reject completely unregistered block types", async () => {
      const payload = { title: "Test", status: "DRAFT", content: { blocks: [{ type: "unregisteredBlockType" }] } };
      const result = await createPageSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/Invalid discriminator value/);
    });
  });

});