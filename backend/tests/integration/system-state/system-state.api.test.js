import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import { systemStateStore } from "../../../src/shared/core/systemStateStore.js";
import bcrypt from "bcrypt";

describe("System State API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "IntegrationPass123!";

  let superAdminToken = "";
  let normalAdminToken = "";
  let superAdminId = "";

  // To track and safely restore global state
  let originalDbConfig = null;
  let originalMemoryConfig = null;
  let currentVersion = 1;
  let bypassToken = "";

  beforeAll(async () => {
    // Backup existing system state to prevent affecting other test suites
    originalDbConfig = await prisma.setting.findUnique({ where: { key: "system_state_config" } });
    originalMemoryConfig = systemStateStore.get();

    // Enforce a clean ACTIVE baseline for this test run
    const baselineConfig = {
      state: "ACTIVE",
      title: "Test Baseline",
      description: "Baseline config",
      estimatedCompletion: null,
      supportEmail: "support@example.com",
      supportPhone: "1234567890",
      showSocialLinks: true,
      allowSearchEngine: true,
      enabledBy: null,
      enabledAt: null,
      reason: "Integration Testing",
      version: 1,
      bypassToken: null,
    };

    await prisma.setting.upsert({
      where: { key: "system_state_config" },
      update: { value: baselineConfig },
      create: { key: "system_state_config", value: baselineConfig }
    });

    // Sync in-memory store
    await systemStateStore.initialize();
    currentVersion = 1;

    // Create System Roles
    const sysRoleAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysRoleSuperAdmin = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });

    //Create Test Actors
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    
    const superAdmin = await prisma.user.create({
      data: { name: `Super ${runId}`, email: `super_state_${runId}@test.com`, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleSuperAdmin.id }
    });
    superAdminId = superAdmin.id;

    const normalAdmin = await prisma.user.create({
      data: { name: `Admin ${runId}`, email: `admin_state_${runId}@test.com`, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleAdmin.id }
    });

    // Login to retrieve tokens (Using IP spoofing to avoid rate limits)
    let ipCounter = 50;
    const getToken = async (email) => {
      const res = await request(app)
        .post("/api/v1/auth/admin-login")
        .set("X-Forwarded-For", `192.168.200.${ipCounter++}`)
        .send({ email, password: rawPassword });
      return res.body.data.accessToken;
    };

    superAdminToken = await getToken(superAdmin.email);
    normalAdminToken = await getToken(normalAdmin.email);
  });

  afterAll(async () => {
    // Restore Original System State
    if (originalDbConfig) {
      await prisma.setting.update({ where: { key: "system_state_config" }, data: { value: originalDbConfig.value } });
      systemStateStore.set(originalDbConfig.value);
    } else {
      await prisma.setting.deleteMany({ where: { key: "system_state_config" } });
      systemStateStore.state = null; // Wipe if it didn't exist before
    }

    // Cleanup Test Run Data
    await prisma.settingRevision.deleteMany({ where: { actorId: superAdminId } });
    await prisma.refreshToken.deleteMany({ where: { user: { email: { contains: runId } } } });
    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    await prisma.$disconnect();
  });

  // Authentication & Authorization
  describe("A. Authentication & Authorization", () => {
    it("SSA-01: Token chara GET configuration (401)", async () => {
      const res = await request(app).get("/api/v1/admin/system-state");
      expect(res.status).toBe(401);
    });

    it("SSA-02: Invalid Bearer token diye GET (401)", async () => {
      const res = await request(app).get("/api/v1/admin/system-state").set("Authorization", "Bearer invalid");
      expect(res.status).toBe(401);
    });

    it("SSA-03: Token chara PUT update (401)", async () => {
      const res = await request(app).put("/api/v1/admin/system-state").send({ state: "MAINTENANCE", version: currentVersion });
      expect(res.status).toBe(401);
    });

    it("SSA-04: Normal ADMIN user diye GET (403)", async () => {
      const res = await request(app).get("/api/v1/admin/system-state").set("Authorization", `Bearer ${normalAdminToken}`);
      expect(res.status).toBe(403);
    });

    it("SSA-05: SUPER_ADMIN diye GET configuration (200)", async () => {
      const res = await request(app).get("/api/v1/admin/system-state").set("Authorization", `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("state");
      expect(res.body.data).toHaveProperty("version");
    });
  });

  // GET Configuration
  describe("B. GET Configuration", () => {
    it("SSG-01: Initialized store theke configuration return korbe (200)", async () => {
      const res = await request(app).get("/api/v1/admin/system-state").set("Authorization", `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.state).toBe("ACTIVE");
      expect(res.body.data.version).toBe(currentVersion);
    });
  });

  // PUT Configuration & State Enum
  describe("C & D. PUT Configuration & All Supported States", () => {
    it("SSU-01, SSU-03, SSU-04, SSU-05: ACTIVE theke MAINTENANCE (200), version increment, DB and Audit persist", async () => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "MAINTENANCE", version: currentVersion, title: "Going Down" });

      expect(res.status).toBe(200);
      expect(res.body.data.state).toBe("MAINTENANCE");
      
      currentVersion++;
      expect(res.body.data.version).toBe(currentVersion);
      expect(res.body.data.bypassToken).not.toBeNull();
      bypassToken = res.body.data.bypassToken;

      // Verify Database Persistence
      const dbRecord = await prisma.setting.findUnique({ where: { key: "system_state_config" } });
      expect(dbRecord.value.state).toBe("MAINTENANCE");
      expect(dbRecord.value.version).toBe(currentVersion);

      // Verify Audit Revision
      const revisions = await prisma.settingRevision.findMany({ where: { actorId: superAdminId } });
      expect(revisions.length).toBeGreaterThan(0);
      expect(revisions[revisions.length - 1].value.state).toBe("MAINTENANCE");
    });

    const otherStates = ["READ_ONLY", "EMERGENCY", "COMING_SOON"];
    it.each(otherStates)("SSU-06: Transition to %s maintains functionality and increments version", async (state) => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state, version: currentVersion });

      expect(res.status).toBe(200);
      expect(res.body.data.state).toBe(state);
      
      currentVersion++;
      expect(res.body.data.version).toBe(currentVersion);
    });

    it("SSU-02: Transistion back to ACTIVE (200), bypass token cleared", async () => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "ACTIVE", version: currentVersion });

      expect(res.status).toBe(200);
      expect(res.body.data.state).toBe("ACTIVE");
      expect(res.body.data.bypassToken).toBeNull(); // Cleared
      
      currentVersion++;
    });
  });

  // Version Conflict (Optimistic Concurrency)
  describe("E. Version Conflict", () => {
    it("SSV-01 & SSV-02: Stale version diye update (409) and database remains unchanged", async () => {
      const staleVersion = currentVersion - 1; // Explicitly stale
      
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "MAINTENANCE", version: staleVersion });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("Concurrency conflict");

      // Verify no DB mutation occurred
      const dbRecord = await prisma.setting.findUnique({ where: { key: "system_state_config" } });
      expect(dbRecord.value.version).toBe(currentVersion); // Still the current version
      expect(dbRecord.value.state).toBe("ACTIVE"); // Still ACTIVE
    });
  });

  // Request Validation (Strict Mode)
  describe("F. Request Validation", () => {
    const getPayload = (overrides) => ({ state: "ACTIVE", version: currentVersion, ...overrides });

    const invalidCases = [
      { id: "SSV-03", payload: { version: 1 }, desc: "state missing" },
      { id: "SSV-04", payload: getPayload({ state: "INVALID" }), desc: "invalid state" },
      { id: "SSV-05", payload: { state: "ACTIVE" }, desc: "version missing" },
      { id: "SSV-06", payload: getPayload({ version: 0 }), desc: "version: 0" },
      { id: "SSV-07", payload: getPayload({ version: 1.5 }), desc: "version: 1.5" },
      { id: "SSV-08", payload: getPayload({ hackField: "malicious" }), desc: "unknown field (strict mode)" },
      { id: "SSV-09", payload: getPayload({ title: "A".repeat(151) }), desc: "title > 150 chars" },
      { id: "SSV-10", payload: getPayload({ description: "A".repeat(1001) }), desc: "description > 1000 chars" },
      { id: "SSV-11", payload: getPayload({ estimatedCompletion: "bad-date" }), desc: "invalid datetime" },
      { id: "SSV-12", payload: getPayload({ supportEmail: "bad-email" }), desc: "invalid supportEmail" },
      { id: "SSV-13", payload: getPayload({ supportPhone: "1".repeat(26) }), desc: "supportPhone > 25 chars" },
      { id: "SSV-14", payload: getPayload({ showSocialLinks: "true" }), desc: "boolean field as string" },
      { id: "SSV-15", payload: getPayload({ bypassToken: "A".repeat(65) }), desc: "bypassToken > 64 chars" },
      { id: "SSV-16", payload: getPayload({ backgroundImage: "A".repeat(2001) }), desc: "backgroundImage > 2000 chars" },
    ];

    it.each(invalidCases)("$id: Should return 400 for$desc", async ({ payload }) => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("SSV-17: Boolean default values omission behavior (Sparse update)", async () => {
      // First explicitly set to false
      const res1 = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "ACTIVE", version: currentVersion, showSocialLinks: false });
      
      expect(res1.status).toBe(200);
      expect(res1.body.data.showSocialLinks).toBe(false);
      currentVersion++;

      // Next omit it entirely. Schema defaults it to TRUE.
      const res2 = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "ACTIVE", version: currentVersion });
      
      expect(res2.status).toBe(200);
      expect(res2.body.data.showSocialLinks).toBe(true);
      currentVersion++;
    });
  });

  // System State Gatekeeper Middleware
  describe("G. System State Gatekeeper", () => {
    let gatekeeperCookie = "";
    

    it("SSGK-01: State ACTIVE hole public request normal route response pabe (503 noy)", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.status).not.toBe(503);
    });

    it("Setup: Transition to MAINTENANCE for Gatekeeper testing", async () => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "MAINTENANCE", version: currentVersion, title: "Blocked Mode" });
      
      expect(res.status).toBe(200);
      currentVersion++;
      bypassToken = res.body.data.bypassToken; // Capture new token
    });

    it("SSGK-02: State MAINTENANCE hole non-whitelisted public request (503)", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.status).toBe(503);
    });

    it("SSGK-03 & SSGK-04: Blocked response has specific Retry-After and Cache-Control headers", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.headers["retry-after"]).toBe("3600");
      expect(res.headers["cache-control"]).toBe("no-store, no-cache, must-revalidate, proxy-revalidate");
    });

    it("SSGK-05: Response body-te isMaintenance, state ebong maintenance metadata thakbe", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.body.success).toBe(false);
      expect(res.body.isMaintenance).toBe(true);
      expect(res.body.state).toBe("MAINTENANCE");
      expect(res.body.meta.title).toBe("Blocked Mode");
    });

    it("SSGK-09: Whitelisted health endpoint maintenance-eo pass kore (200)", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
    });

    it("SSGK-10: Static asset extension maintenance-eo pass kore (404 Not Found, not 503)", async () => {
      const res = await request(app).get("/fake-asset.css");
      expect(res.status).toBe(404); // Passed gatekeeper, hit Express 404
    });

    it("SSGK-06: Valid query maintenance_bypass token -> Request proceeds, cookie is set", async () => {
      const res = await request(app).get(`/api/v1/projects?maintenance_bypass=${bypassToken}`);
      
      expect(res.status).not.toBe(503);
      
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.includes("maintenance_bypass_token="))).toBe(true);
      
      gatekeeperCookie = cookies.find(c => c.startsWith("maintenance_bypass_token="));
    });

    it("SSGK-07: Valid maintenance_bypass_token cookie -> Request proceeds", async () => {
      const res = await request(app)
        .get("/api/v1/projects")
        .set("Cookie", [gatekeeperCookie]);
      
      expect(res.status).not.toBe(503);
    });

    it("SSGK-08: Invalid query token/cookie -> Request blocked (503)", async () => {
      const res1 = await request(app).get("/api/v1/projects?maintenance_bypass=invalid");
      const res2 = await request(app).get("/api/v1/projects").set("Cookie", ["maintenance_bypass_token=invalid"]);
      
      expect(res1.status).toBe(503);
      expect(res2.status).toBe(503);
    });

    it("Teardown: Transition back to ACTIVE to avoid blocking other integration suites", async () => {
      const res = await request(app)
        .put("/api/v1/admin/system-state")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ state: "ACTIVE", version: currentVersion });
      
      expect(res.status).toBe(200);
    });
  });
});