import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

describe("Pages Preview API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "PreviewPassword123!";
  let passwordHash;

  // Trackers
  let actors = {
    super: { id: "", token: "", email: `super_prev_${runId}@test.com` },
    full: { id: "", token: "", email: `full_prev_${runId}@test.com` },
    view: { id: "", token: "", email: `view_prev_${runId}@test.com` },
    previewOnly: { id: "", token: "", email: `preview_only_${runId}@test.com` },
    none: { id: "", token: "", email: `none_prev_${runId}@test.com` }
  };

  // Separated pages for isolated testing
  let pages = {
    genPage: { id: "", slug: `gen-page-${runId}` },
    resPage: { id: "", slug: `res-page-${runId}` },
    expirePage: { id: "", slug: `expire-page-${runId}` },
    deletePage: { id: "", slug: `del-page-${runId}` },
    statusPage: { id: "", slug: `stat-page-${runId}` },
    rateLimitPage: { id: "", slug: `rate-page-${runId}` }
  };

  let validRawTokenForResolve = "";
  let validRawTokenForRateLimit = "";

  // Helper for unique IPs to avoid rate limits except in the specific test
  let ipCounter = 1;
  const getIp = () => `10.0.1.${ipCounter++}`;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(rawPassword, 10);

    // System Roles & Permissions
    const sysAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysSuper = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super", slug: "SUPER_ADMIN" } });

    const pView = await prisma.permission.upsert({ where: { slug: "page.view" }, update: {}, create: { name: "View Page", slug: "page.view", module: "PAGES" } });
    const pPreview = await prisma.permission.upsert({ where: { slug: "page.preview" }, update: {}, create: { name: "Preview Page", slug: "page.preview", module: "PAGES" } });

    // Functional Roles
    const createFr = async (slugPref, perms) => prisma.functionalRole.create({
      data: {
        name: `FR_${slugPref}_${runId}`, slug: `${slugPref}-${runId}`,
        permissions: { create: perms.map(p => ({ permissionId: p })) }
      }
    });

    const frFull = await createFr("prev-full", [pView.id, pPreview.id]);
    const frView = await createFr("prev-view", [pView.id]);
    const frPreviewOnly = await createFr("prev-only", [pPreview.id]);

    // Create Actors
    const setupActor = async (key, sysRoleId, funcRoleId = null) => {
      const u = await prisma.user.create({
        data: {
          name: `Actor ${key}`, email: actors[key].email, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleId,
          functionalRoles: funcRoleId ? { create: [{ functionalRoleId: funcRoleId }] } : undefined
        }
      });
      actors[key].id = u.id;
    };

    await setupActor("super", sysSuper.id);
    await setupActor("full", sysAdmin.id, frFull.id);
    await setupActor("view", sysAdmin.id, frView.id);
    await setupActor("previewOnly", sysAdmin.id, frPreviewOnly.id);
    await setupActor("none", sysAdmin.id);

    // Authenticate Actors
    for (const key of Object.keys(actors)) {
      const res = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", getIp()).send({ email: actors[key].email, password: rawPassword });
      actors[key].token = res.body.data.accessToken;
    }

    // Create Draft Pages
    for (const key of Object.keys(pages)) {
      const p = await prisma.page.create({
        data: {
          title: `Test ${key}`, slug: pages[key].slug, fullPath: `/${pages[key].slug}`,
          content: { blocks: [] }, status: "DRAFT", authorId: actors.super.id, updatedById: actors.super.id
        }
      });
      pages[key].id = p.id;
    }
  });

  afterAll(async () => {
    // teardown
    await prisma.pagePreviewToken.deleteMany({ where: { createdById: { in: Object.values(actors).map(a => a.id) } } });
    await prisma.pageRevision.deleteMany({ where: { pageId: { in: Object.values(pages).map(p => p.id) } } });
    await prisma.pagePathHistory.deleteMany({ where: { pageId: { in: Object.values(pages).map(p => p.id) } } });
    await prisma.page.deleteMany({ where: { id: { in: Object.values(pages).map(p => p.id) } } });

    await prisma.userFunctionalRole.deleteMany({ where: { user: { email: { contains: runId } } } });
    await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: runId } } } });
    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    
    await prisma.functionalRolePermission.deleteMany({ where: { functionalRole: { slug: { contains: runId } } } });
    await prisma.functionalRole.deleteMany({ where: { slug: { contains: runId } } });
    await prisma.$disconnect();
  });

  // Authentication & RBAC
  describe("A. Authentication & RBAC", () => {
    it("AUTH-01: Token chara preview link generate (401)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(401);
    });

    it("AUTH-02: Invalid bearer token diye status check (401)", async () => {
      const res = await request(app).get(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", "Bearer invalid").set("X-Forwarded-For", getIp());
      expect(res.status).toBe(401);
    });

    it("AUTH-03: page.preview permission nei emon admin diye generate (403)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", `Bearer ${actors.none.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(403);
    });

    it("AUTH-04: Permission nei emon admin diye status check (403)", async () => {
      const res = await request(app).get(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", `Bearer ${actors.none.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(403);
    });

    it("AUTH-05: Permission nei emon admin diye revoke (403)", async () => {
      const res = await request(app).delete(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", `Bearer ${actors.none.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(403);
    });

    it("AUTH-06: Sudhu page.view permission ache, kintu page.preview nei (403)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", `Bearer ${actors.view.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(403);
    });

    it("AUTH-07: SUPER_ADMIN-er preview access (201)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.genPage.id}/preview-link`).set("Authorization", `Bearer ${actors.super.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(201);
    });
  });

  // Generate preview link
  describe("B. Generate preview link", () => {
    let firstRawToken = "";

    it("GEN-01: Valid DRAFT page-er preview link generate (201)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.resPage.id}/preview-link`).set("Authorization", `Bearer ${actors.previewOnly.token}`).set("X-Forwarded-For", getIp());
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("previewUrl");

      const previewUrl = res.body.data.previewUrl;
      firstRawToken = previewUrl.split("/preview/")[1];
      
      expect(firstRawToken).toBeDefined();
      expect(firstRawToken).toHaveLength(64);
      expect(firstRawToken).toMatch(/^[a-f0-9]{64}$/);
    });

    it("GEN-02: Nonexistent but valid CUID page ID (404)", async () => {
      const res = await request(app).post("/api/v1/admin/pages/cuid12345678901234567890/preview-link").set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(404);
    });

    it("GEN-03: Invalid page ID format (400)", async () => {
      const res = await request(app).post("/api/v1/admin/pages/bad-id/preview-link").set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(400);
    });

    it("GEN-04: Same page-er jonno second link generate korle first token replace hoy", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${pages.resPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(201);

      validRawTokenForResolve = res.body.data.previewUrl.split("/preview/")[1];

      const oldResolve = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: firstRawToken });
      expect(oldResolve.status).toBe(404);

      const newResolve = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      expect(newResolve.status).toBe(200);
    });

    it("GEN-05: Deleted page-er jonno link generate (404)", async () => {
      await prisma.page.update({ where: { id: pages.deletePage.id }, data: { deletedAt: new Date() } });
      const res = await request(app).post(`/api/v1/admin/pages/${pages.deletePage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(404);
    });

    it("GEN-06: Token-er database persistence, hash, creator ebong expiry verify", async () => {
      const dbTokens = await prisma.pagePreviewToken.findMany({ where: { pageId: pages.resPage.id } });
      
      expect(dbTokens.length).toBe(1);
      
      const dbToken = dbTokens[0];
      const expectedHash = crypto.createHash("sha256").update(validRawTokenForResolve).digest("hex");
      
      expect(dbToken.tokenHash).toBe(expectedHash);
      expect(dbToken.tokenHash).not.toBe(validRawTokenForResolve);
      expect(dbToken.createdById).toBe(actors.full.id);
      
      const timeDiff = new Date(dbToken.expiresAt).getTime() - Date.now();
      expect(timeDiff).toBeGreaterThan(23.5 * 60 * 60 * 1000);
    });
  });

  // Public Preview Resolve
  describe("C. Public Preview Resolve", () => {
    it("RES-01: Body-te token nei (400)", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({});
      expect(res.status).toBe(400);
    });

    it("RES-02: Token khub chhoto (400)", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: "abc" });
      expect(res.status).toBe(400);
    });

    it("RES-03: Unknown token, kintu minimum length valid (404)", async () => {
      const fakeToken = "a".repeat(64);
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: fakeToken });
      expect(res.status).toBe(404);
    });

    it("RES-04: Valid token diye DRAFT page resolve; login chara (200)", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      expect(res.status).toBe(200);
      expect(res.body.data.page.id).toBe(pages.resPage.id);
      expect(res.body.data.page.status).toBe("DRAFT");
    });

    it("RES-05: Expired token resolve (410)", async () => {
      // Generate token
      const genRes = await request(app).post(`/api/v1/admin/pages/${pages.expirePage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      const rawToken = genRes.body.data.previewUrl.split("/preview/")[1];
      
      // Manipulate DB to expire token
      await prisma.pagePreviewToken.updateMany({
        where: { pageId: pages.expirePage.id },
        data: { expiresAt: new Date(Date.now() - 10000) }
      });

      // Resolve
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: rawToken });
      expect(res.status).toBe(410);
      expect(res.body.message).toContain("expired");
    });

    it("RES-06: Page soft-delete howar por existing token resolve (404)", async () => {
      // Create token for stat-page temporarily
      const genRes = await request(app).post(`/api/v1/admin/pages/${pages.statusPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      const rawToken = genRes.body.data.previewUrl.split("/preview/")[1];

      // Soft delete page
      await prisma.page.update({ where: { id: pages.statusPage.id }, data: { deletedAt: new Date() } });

      // Attempt resolve
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: rawToken });
      expect(res.status).toBe(404);

      // Restore page for next tests
      await prisma.page.update({ where: { id: pages.statusPage.id }, data: { deletedAt: null } });
    });

    it("RES-07: Successful response-e robots header (noindex, nofollow)", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      expect(res.headers["x-robots-tag"]).toBe("noindex, nofollow");
    });

    it("RES-08: Public serializer sensitive fields expose korche na", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      const pageData = res.body.data.page;

      expect(pageData).not.toHaveProperty("authorId");
      expect(pageData).not.toHaveProperty("updatedById");
      expect(pageData).not.toHaveProperty("deletedAt");
      expect(pageData).not.toHaveProperty("parentId");
      
      if (pageData.author) {
        expect(pageData.author).not.toHaveProperty("id");
        expect(pageData.author).toHaveProperty("name");
      }
    });

    it("RES-09: Resolve-er por token usage tracking update hoy", async () => {
      await new Promise(r => setTimeout(r, 300));
      
      // Current token usage before
      const dbBefore = await prisma.pagePreviewToken.findFirst({ where: { pageId: pages.resPage.id } });
      const initialCount = dbBefore.usedCount;

      // Trigger resolution
      await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      
      // Wait briefly for fire-and-forget promise to resolve in DB
      await new Promise(r => setTimeout(r, 300));

      const dbAfter = await prisma.pagePreviewToken.findFirst({ where: { pageId: pages.resPage.id } });
      expect(dbAfter.usedCount).toBe(initialCount + 1);
      expect(dbAfter.lastAccessedAt).not.toBeNull();
    });
  });

  // Preview Status
  describe("D. Preview Status", () => {
    it("STAT-01: Page-er kono token nei", async () => {
      await prisma.pagePreviewToken.deleteMany({ where: { pageId: pages.expirePage.id } });
      const res = await request(app).get(`/api/v1/admin/pages/${pages.expirePage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      
      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });

    it("STAT-02: Active token ache", async () => {
      const res = await request(app).get(`/api/v1/admin/pages/${pages.resPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      
      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(true);
      expect(res.body.data).toHaveProperty("usedCount");
      expect(res.body.data).toHaveProperty("createdAt");
      expect(res.body.data).toHaveProperty("expiresAt");
    });

    it("STAT-03: Token expired", async () => {
      await request(app).post(`/api/v1/admin/pages/${pages.statusPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      await prisma.pagePreviewToken.updateMany({ where: { pageId: pages.statusPage.id }, data: { expiresAt: new Date(Date.now() - 5000) } });

      const res = await request(app).get(`/api/v1/admin/pages/${pages.statusPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
      expect(res.body.data.isExpired).toBe(true);
    });
  });

  // Revoke Preview Link
  describe("E. Revoke Preview Link", () => {
    it("REV-01: Active token revoke (200)", async () => {
      const res = await request(app).delete(`/api/v1/admin/pages/${pages.resPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(200);
      
      const dbTokens = await prisma.pagePreviewToken.count({ where: { pageId: pages.resPage.id } });
      expect(dbTokens).toBe(0);
    });

    it("REV-02: Revoke-er por purono token resolve (404)", async () => {
      const res = await request(app).post("/api/v1/preview/resolve").set("X-Forwarded-For", getIp()).send({ token: validRawTokenForResolve });
      expect(res.status).toBe(404);
    });

    it("REV-03: Same page-e abar revoke, jokhon token nei (200)", async () => {
      const res = await request(app).delete(`/api/v1/admin/pages/${pages.resPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp());
      expect(res.status).toBe(200);
    });
  });

  // Rate limiting
  describe("F. Rate Limiting", () => {
    it("RATE-01: Same IP theke ek minute-e 10-er beshi resolve attempt (11th req is 429)", async () => {
      const rateLimitIp = getIp();
      const genRes = await request(app).post(`/api/v1/admin/pages/${pages.rateLimitPage.id}/preview-link`).set("Authorization", `Bearer ${actors.full.token}`).set("X-Forwarded-For", getIp()); // Setup IP differs
      validRawTokenForRateLimit = genRes.body.data.previewUrl.split("/preview/")[1];

      // Fire 10 requests rapidly
      for (let i = 0; i < 10; i++) {
        const res = await request(app).post("/api/v1/preview/resolve")
          .set("X-Forwarded-For", rateLimitIp)
          .send({ token: validRawTokenForRateLimit });
        
        expect(res.status).toBe(200);
      }

      // Fire the 11th request
      const resBlocked = await request(app).post("/api/v1/preview/resolve")
        .set("X-Forwarded-For", rateLimitIp)
        .send({ token: validRawTokenForRateLimit });

      expect(resBlocked.status).toBe(429);
      expect(resBlocked.body.success).toBe(false);
      expect(resBlocked.body.message).toContain("Too many preview resolution attempts");
    });
  });
});