import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";

const cmsSectionKeys = [
  "global_header_menu",
  "homepage_general",
  "homepage_footer",
  "cms_settings",
  "whatsapp_settings",
  "global_general_settings",
  "contact_routing_settings",
  "nc_contact_page",
  "nc_homepage_hero",
  "nc_homepage_mandalas",
  "nc_homepage_living_art",
  "nc_homepage_showcase",
  "nc_homepage_plant_display",
  "nc_homepage_services",
  "nc_homepage_partners",
  "nc_homepage_blogs",
  "nc_homepage_what_they_say",
  "nc_homepage_cta",
  "gulmo_hero",
  "gulmo_terrarium",
  "gulmo_quote",
  "gulmo_forest_organism",
  "gulmo_our_projects",
  "gulmo_lets_begin",
  "gulmo_concept",
];

describe("CMS API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "SecurePassword123!";

  let actors = {
    super: { id: "", email: `super_cms_${runId}@test.com`, token: "" },
    admin: { id: "", email: `admin_cms_${runId}@test.com`, token: "" },
    restricted: { id: "", email: `restricted_cms_${runId}@test.com`, token: "" },
  };

  // State preservation maps
  const originalSettings = new Map();
  let originalSystemState = null;

  // Unique IP helper
  let ipCounter = 1;
  const getIp = () => `192.168.120.${ipCounter++}`;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Snapshot existing CMS settings
    const existingSettings = await prisma.setting.findMany({
      where: { key: { in: [...cmsSectionKeys, "system_state_config"] } }
    });
    
    for (const key of cmsSectionKeys) {
      const existing = existingSettings.find(s => s.key === key);
      originalSettings.set(key, existing ? { exists: true, value: existing.value } : { exists: false });
    }
    
    const sysState = existingSettings.find(s => s.key === "system_state_config");
    if (sysState) {
      originalSystemState = sysState.value;
    }

    // Inject bypass token for security test
    await prisma.setting.upsert({
      where: { key: "system_state_config" },
      update: { value: { state: "MAINTENANCE", bypassToken: "leak_me_secret_token" } },
      create: { key: "system_state_config", value: { state: "MAINTENANCE", bypassToken: "leak_me_secret_token" } }
    });

    // Ensure System Roles
    const sysAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysSuper = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });
    const sysUser = await prisma.systemRole.upsert({ where: { slug: "USER" }, update: {}, create: { name: "User", slug: "USER" } });

    // Create Test Actors
    const setupActor = async (key, sysRoleId) => {
      const u = await prisma.user.create({
        data: { name: `CMS Actor ${key}`, email: actors[key].email, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleId }
      });
      actors[key].id = u.id;
    };

    await setupActor("super", sysSuper.id);
    await setupActor("admin", sysAdmin.id);
    await setupActor("restricted", sysUser.id);

    // Authenticate
    for (const key of Object.keys(actors)) {
      const endpoint = key === "restricted" ? "/api/v1/auth/login" : "/api/v1/auth/admin-login";
      const res = await request(app).post(endpoint).set("X-Forwarded-For", getIp()).send({ email: actors[key].email, password: rawPassword });
      actors[key].token = res.body.data.accessToken;
    }
  });

  afterAll(async () => {
    // Restore original CMS settings & delete new ones
    for (const [key, data] of originalSettings.entries()) {
      if (data.exists) {
        await prisma.setting.update({ where: { key }, data: { value: data.value } });
      } else {
        await prisma.setting.deleteMany({ where: { key } });
      }
    }

    // Restore system state
    if (originalSystemState) {
      await prisma.setting.update({ where: { key: "system_state_config" }, data: { value: originalSystemState } });
    } else {
      await prisma.setting.deleteMany({ where: { key: "system_state_config" } });
    }

    // Delete test-generated revisions using our unique actor IDs
    const testActorIds = Object.values(actors).map(a => a.id).filter(Boolean);
    if (testActorIds.length > 0) {
      await prisma.settingRevision.deleteMany({
        where: { actorId: { in: testActorIds } }
      });
    }

    // Delete test users
    await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: runId } } } });
    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    
    await prisma.$disconnect();
  });

  // Authentication & Access Control
  describe("A. Authentication & Access Control", () => {
    it("CMS-AUTH-01: Token chara public single-section GET (200)", async () => {
      const res = await request(app).get("/api/v1/cms/section/homepage_general");
      expect(res.status).toBe(200);
    });

    it("CMS-AUTH-02: Token chara public multiple-section GET (200)", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=homepage_general,homepage_footer");
      expect(res.status).toBe(200);
    });

    it("CMS-AUTH-03: Token chara PUT update (401)", async () => {
      const res = await request(app).put("/api/v1/cms/section/homepage_general").send({ content: {} });
      expect(res.status).toBe(401);
    });

    it("CMS-AUTH-04: Invalid bearer token diye PUT (401)", async () => {
      const res = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", "Bearer invalid").send({ content: {} });
      expect(res.status).toBe(401);
    });

    it("CMS-AUTH-05: ADMIN user update kore (200)", async () => {
      const res = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: {} });
      expect(res.status).toBe(200);
    });

    it("CMS-AUTH-06: SUPER_ADMIN user update kore (200)", async () => {
      const res = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.super.token}`).send({ content: {} });
      expect(res.status).toBe(200);
    });

    it("CMS-AUTH-07: Onno system role-er user update korte gele (403)", async () => {
      const res = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.restricted.token}`).send({ content: {} });
      expect(res.status).toBe(403);
    });

    it("CMS-AUTH-08: No-token request-e invalid section key pathaleo authentication age check hoy (401)", async () => {
      const res = await request(app).put("/api/v1/cms/section/fake_invalid_key").send({ content: {} });
      expect(res.status).toBe(401); // Auth triggers before validation/registry check
    });
  });

  // Single-section GET
  describe("B. Single-section GET (/api/v1/cms/section/:sectionKey)", () => {
    it("CMS-GET-01: Registered key ache, kintu DB-te setting nei (200, fallback {})", async () => {
      // Force delete to ensure it's empty
      await prisma.setting.deleteMany({ where: { key: "nc_homepage_hero" } });
      const res = await request(app).get("/api/v1/cms/section/nc_homepage_hero");
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({ content: {} });
    });

    it("CMS-GET-02 & CMS-GET-03: DB-te setting already ache, envelope thik (200)", async () => {
      const mockValue = { content: { titleLine1: "Hello World" } };
      await prisma.setting.upsert({
        where: { key: "nc_homepage_hero" },
        update: { value: mockValue },
        create: { key: "nc_homepage_hero", value: mockValue }
      });

      const res = await request(app).get("/api/v1/cms/section/nc_homepage_hero");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockValue);
    });

    it("CMS-GET-04: Registry-te nei emon key (404)", async () => {
      const res = await request(app).get("/api/v1/cms/section/unregistered_key");
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("not found");
    });
  });

  // Multiple-section GET
  describe("C. Multiple-section GET (/api/v1/cms/sections)", () => {
    beforeAll(async () => {
      await prisma.setting.upsert({ where: { key: "homepage_footer" }, update: { value: { content: { description: "Footer" } } }, create: { key: "homepage_footer", value: { content: { description: "Footer" } } } });
      await prisma.setting.deleteMany({ where: { key: "nc_homepage_mandalas" } }); // ensure missing
    });

    it("CMS-LIST-01: keys query missing (400)", async () => {
      const res = await request(app).get("/api/v1/cms/sections");
      expect(res.status).toBe(400);
    });

    it("CMS-LIST-02 & CMS-LIST-04: Request saved and unsaved keys (200)", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=homepage_footer,nc_homepage_mandalas");
      expect(res.status).toBe(200);
      expect(res.body.data.homepage_footer).toEqual({ content: { description: "Footer" } });
      expect(res.body.data.nc_homepage_mandalas).toEqual({ content: {} }); // Fallback
    });

    it("CMS-LIST-03: Keys-er age/pore whitespace trim hoye resolve hoy", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=  homepage_footer  ,  nc_homepage_mandalas  ");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("homepage_footer");
      expect(res.body.data).toHaveProperty("nc_homepage_mandalas");
    });

    it("CMS-LIST-05: Duplicate key resolve without duplicating output", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=homepage_footer,homepage_footer");
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(1);
    });

    it("CMS-LIST-06: Shudhu comma/blank values invalid query reject (400)", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=,, ,");
      expect(res.status).toBe(400);
    });

    it("CMS-LIST-07: Repeated keys query parameter array hoye gele reject kore (400)", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=a&keys=b");
      expect(res.status).toBe(400);
    });

    it("CMS-LIST-08: Security - system_state_config expose na kora (No leak)", async () => {
      const res = await request(app).get("/api/v1/cms/sections?keys=system_state_config");
      
      const responseStr = JSON.stringify(res.body);
      
      expect(
        responseStr, 
        "SECURITY LEAK: system_state_config bypass token exposed in public CMS endpoint!"
      ).not.toContain("leak_me_secret_token");
    });
  });

  // PUT Update: Persistence & Revisions
  describe("D. PUT update: persistence, defaults, revision", () => {
    it("CMS-PUT-01 & 02: Valid update creates DB row matching parsed content (200)", async () => {
      const payload = { content: { landingPage: "reference" } }; // Valid schema
      const res = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.admin.token}`).send(payload);
      
      expect(res.status).toBe(200);
      expect(res.body.data.content.landingPage).toBe("reference");

      const dbSetting = await prisma.setting.findUnique({ where: { key: "homepage_general" } });
      expect(dbSetting.value.content.landingPage).toBe("reference");
    });

    it("CMS-PUT-03 & 04 & 05: Repeated updates save previous values to SettingRevision with actorId", async () => {
      const payload1 = { content: { isActive: false } };
      await request(app).put("/api/v1/cms/section/whatsapp_settings").set("Authorization", `Bearer ${actors.admin.token}`).send(payload1);

      const payload2 = { content: { isActive: true } };
      await request(app).put("/api/v1/cms/section/whatsapp_settings").set("Authorization", `Bearer ${actors.admin.token}`).send(payload2);

      // Verify revision creation
      const dbSetting = await prisma.setting.findUnique({ where: { key: "whatsapp_settings" } });
      const revisions = await prisma.settingRevision.findMany({ where: { settingId: dbSetting.id }, orderBy: { createdAt: "desc" } });
      
      expect(revisions.length).toBeGreaterThanOrEqual(1);
      const latestRevision = revisions[0];
      
      expect(latestRevision.actorId).toBe(actors.admin.id);
      expect(latestRevision.value.content.isActive).toBe(false); // Validating pre-update state was stored
    });

    it("CMS-PUT-06: Invalid/unknown section key (400)", async () => {
      const res = await request(app).put("/api/v1/cms/section/ghost_section").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: {} });
      expect(res.status).toBe(400); // Handled by dynamicValidate
    });

    it("CMS-PUT-07 & 08: Invalid content type and missing content wrapper (400)", async () => {
      const r1 = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: "string" });
      const r2 = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.admin.token}`).send({ missingContent: true });
      expect(r1.status).toBe(400);
      expect(r2.status).toBe(400);
    });
  });

  // Registry All Sections - Valid Payloads
  describe("E. Registry-r shob 25-ta section-er valid payload", () => {
    it.each(cmsSectionKeys)("%s accepts a minimal valid payload", async (sectionKey) => {
      const res = await request(app)
        .put(`/api/v1/cms/section/${sectionKey}`)
        .set("Authorization", `Bearer ${actors.admin.token}`)
        .send({ content: {} });

      expect(res.status, `${sectionKey} failed: ${JSON.stringify(res.body)}`).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("content");
    });

    it("Default value assertions for specific schemas", async () => {
      const hg = await request(app).put("/api/v1/cms/section/homepage_general").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: {} });
      expect(hg.body.data.content.landingPage).toBe("default");

      const wa = await request(app).put("/api/v1/cms/section/whatsapp_settings").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: {} });
      expect(wa.body.data.content.isActive).toBe(true);

      const hm = await request(app).put("/api/v1/cms/section/global_header_menu").set("Authorization", `Bearer ${actors.admin.token}`).send({ content: {} });
      expect(hm.body.data.content.menuItems).toEqual([]);
    });
  });

  // Validation Test Matrix (Strict Limits)
  describe("F. Validation test matrix", () => {
    const put = async (key, content) => request(app).put(`/api/v1/cms/section/${key}`).set("Authorization", `Bearer ${actors.admin.token}`).send({ content });

    it("homepage_general: Invalid enum & extra property (strict) -> 400", async () => {
      expect((await put("homepage_general", { landingPage: "fake" })).status).toBe(400);
      expect((await put("homepage_general", { landingPage: "default", extra: "bad" })).status).toBe(400);
    });

    it("cms_settings & whatsapp_settings: Wrong types and length -> 400", async () => {
      expect((await put("cms_settings", { cmsName: "a".repeat(101) })).status).toBe(400);
      expect((await put("whatsapp_settings", { isActive: "true" })).status).toBe(400); // expects boolean
    });

    it("homepage_footer & global_general_settings: Overlengths & emails -> 400", async () => {
      expect((await put("homepage_footer", { description: "a".repeat(1001) })).status).toBe(400);
      expect((await put("global_general_settings", { supportEmail: "not-an-email" })).status).toBe(400);
    });

    it("contact_routing_settings & nc_contact_page: Array emails & catchall -> 400/200", async () => {
      expect((await put("contact_routing_settings", { notifyEmails: ["bad"] })).status).toBe(400);
      expect((await put("nc_contact_page", { mapEmbedCode: "a".repeat(3001) })).status).toBe(400);
      
      // Catchall test (should pass 200)
      const catchallRes = await put("nc_contact_page", { someUnknownProp: "Accepted" });
      expect(catchallRes.status).toBe(200);
      expect(catchallRes.body.data.content.someUnknownProp).toBe("Accepted");
    });

    it("Nature Cube Arrays limits (hero, showcase, partners, blogs) -> 400", async () => {
      expect((await put("nc_homepage_hero", { features: Array(5).fill({}) })).status).toBe(400);
      expect((await put("nc_homepage_showcase", { galleryImages: Array(4).fill("img") })).status).toBe(400);
      expect((await put("nc_homepage_partners", { partnerLogos: Array(9).fill("img") })).status).toBe(400);
      expect((await put("nc_homepage_blogs", { cards: Array(5).fill({}) })).status).toBe(400);
    });

    it("Gulmo & Others: Various length boundaries -> 400", async () => {
      expect((await put("nc_homepage_cta", { buttonLink: "a".repeat(201) })).status).toBe(400);
      expect((await put("gulmo_hero", { backgroundImage: 123 })).status).toBe(400);
      expect((await put("gulmo_terrarium", { cat1Desc: "a".repeat(1501) })).status).toBe(400);
      expect((await put("gulmo_lets_begin", { storeUrl: "a".repeat(501) })).status).toBe(400);
    });

    it("global_header_menu: Recursive children, blank strings, invalid types (200 / 400)", async () => {
      // Invalid Type
      expect((await put("global_header_menu", { menuItems: [{ id: "1", label: "A", type: "invalid", url: "/" }] })).status).toBe(400);
      
      // Blank String
      expect((await put("global_header_menu", { menuItems: [{ id: "1", label: "  ", type: "page", url: "/" }] })).status).toBe(400);
      
      // Recursive Valid
      const nestedPayload = {
        menuItems: [
          {
            id: "parent", label: "Work", type: "page", url: "/work",
            children: [{ id: "child", label: "Featured", type: "custom", url: "/feat" }]
          }
        ]
      };
      const validRes = await put("global_header_menu", nestedPayload);
      expect(validRes.status).toBe(200);
      expect(validRes.body.data.content.menuItems[0].children[0].label).toBe("Featured");
    });
  });
});