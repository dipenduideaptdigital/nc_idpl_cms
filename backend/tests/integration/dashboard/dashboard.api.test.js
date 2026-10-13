import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";

describe("Dashboard API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "DashPassword123!";
  
  // Actor Tokens
  let superAdminToken = "";
  let regularAdminToken = "";
  let noAdminToken = ""; // USER role

  // Fixture Trackers
  let testFormId = "";
  let testSubmissionId = "";
  let testPageId = "";
  let testBlogId = "";

  // Helper to generate unique IP per block to avoid rate limit collisions
  let ipCounter = 50;
  const getIp = () => `192.168.50.${ipCounter++}`;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // 1. Ensure System Roles exist
    const sysRoleUser = await prisma.systemRole.upsert({ where: { slug: "USER" }, update: {}, create: { name: "User", slug: "USER" } });
    const sysRoleAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysRoleSuperAdmin = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });

    // 2. Create Actors
    const actors = [
      { email: `super_dash_${runId}@test.com`, roleId: sysRoleSuperAdmin.id, tokenRef: 'superAdminToken' },
      { email: `admin_dash_${runId}@test.com`, roleId: sysRoleAdmin.id, tokenRef: 'regularAdminToken' },
      { email: `user_dash_${runId}@test.com`, roleId: sysRoleUser.id, tokenRef: 'noAdminToken' }
    ];

    for (const actor of actors) {
      await prisma.user.create({
        data: { name: `Dash Actor`, email: actor.email, password: passwordHash, status: "ACTIVE", systemRoleId: actor.roleId }
      });
    }

    // 3. Login to get tokens
    const getToken = async (email, roleId) => {
      const endpoint = roleId === sysRoleUser.id ? "/api/v1/auth/login" : "/api/v1/auth/admin-login";
      const res = await request(app)
        .post(endpoint)
        .set("X-Forwarded-For", getIp())
        .send({ email, password: rawPassword });
      
      return res.body?.data?.accessToken;
    };

    superAdminToken = await getToken(actors[0].email, actors[0].roleId);
    regularAdminToken = await getToken(actors[1].email, actors[1].roleId);
    noAdminToken = await getToken(actors[2].email, actors[2].roleId);

    // 4. Create Dashboard Fixtures (Forms, Pages, Blogs)
    // A. Form & Submissions
    const form = await prisma.dynamicForm.create({
      data: {
        title: `Test Form ${runId}`, slug: `test-form-${runId}`, schema: {}, settings: {},
        author: { connect: { email: actors[0].email } },
        status: "PUBLISHED"
      }
    });
    testFormId = form.id;

    const sub = await prisma.formSubmission.create({
      data: {
        formId: testFormId, formVersion: 1, payload: { name: "Test Lead" }, ipAddress: "1.1.1.1", status: "NEW", isViewed: false
      }
    });
    testSubmissionId = sub.id;

    // Submission Note (Activity)
    await prisma.formSubmissionNote.create({
      data: { submissionId: testSubmissionId, authorId: (await prisma.user.findFirst({where: {email: actors[0].email}})).id, text: "Follow up required" }
    });

    // B. Page & Revision (Activity & Metrics)
    const page = await prisma.page.create({
      data: {
        title: `Dash Page ${runId}`, slug: `dash-page-${runId}`, fullPath: `/dash-page-${runId}`, content: {}, status: "PUBLISHED",
        author: { connect: { email: actors[0].email } }
      }
    });
    testPageId = page.id;
    await prisma.pageRevision.create({ data: { pageId: testPageId, snapshot: {}, actorId: (await prisma.user.findFirst({where: {email: actors[0].email}})).id } });

    // C. Blog & Revision (Activity & Metrics)
    const blog = await prisma.blog.create({
      data: {
        title: `Dash Blog ${runId}`, slug: `dash-blog-${runId}`, content: {}, status: "PUBLISHED",
        author: { connect: { email: actors[0].email } }
      }
    });
    testBlogId = blog.id;
    await prisma.blogRevision.create({ data: { blogId: testBlogId, snapshot: {}, actorId: (await prisma.user.findFirst({where: {email: actors[0].email}})).id } });
  });

  afterAll(async () => {
    // Teardown
    await prisma.formSubmissionNote.deleteMany({ where: { submission: { form: { slug: { contains: runId } } } } });
    await prisma.formSubmission.deleteMany({ where: { form: { slug: { contains: runId } } } });
    await prisma.dynamicForm.deleteMany({ where: { slug: { contains: runId } } });
    
    await prisma.pageRevision.deleteMany({ where: { page: { slug: { contains: runId } } } });
    await prisma.page.deleteMany({ where: { slug: { contains: runId } } });
    
    await prisma.blogRevision.deleteMany({ where: { blog: { slug: { contains: runId } } } });
    await prisma.blog.deleteMany({ where: { slug: { contains: runId } } });

    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    await prisma.$disconnect();
  });

  // Authentication & Access Control
  describe("A. Authentication & Boundary", () => {
    it("DASH-AUTH-01: Token chara /metrics request (401)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/metrics");
      expect(res.status).toBe(401);
    });

    it("DASH-AUTH-02: Invalid Bearer token (401)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", "Bearer invalid");
      expect(res.status).toBe(401);
    });

    it("DASH-AUTH-03: Normal/non-admin system role (403)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", `Bearer ${noAdminToken}`);
      expect(res.status).toBe(403);
    });

    it("DASH-AUTH-04 & DASH-AUTH-05: ADMIN and SUPER_ADMIN token diye metrics (200)", async () => {
      const resAdmin = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", `Bearer ${regularAdminToken}`);
      const resSuper = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", `Bearer ${superAdminToken}`);
      
      expect(resAdmin.status).toBe(200);
      expect(resSuper.status).toBe(200);
    });

    it("DASH-AUTH-06: Unauthenticated access to /export-leads (401)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/export-leads");
      expect(res.status).toBe(401);
    });
  });

  // GET /metrics
  describe("B. GET /metrics", () => {
    it("DASH-MET-01 & DASH-MET-02: Valid admin request returns 200 with 4 sections", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data).toHaveProperty("unreadInquiries");
      expect(data).toHaveProperty("newInquiriesToday");
      expect(data).toHaveProperty("stats");
    });

    it("DASH-MET-03 & DASH-MET-04: Stats fields-er structure and unread calculation", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/metrics").set("Authorization", `Bearer ${regularAdminToken}`);
      const stats = res.body.data.stats;
      
      // Checking structure
      expect(stats.formEntries).toHaveProperty("value");
      expect(stats.formEntries).toHaveProperty("trend");
      expect(stats.pages).toHaveProperty("value");
      expect(stats.blogs).toHaveProperty("value");

      // Verify unread inquiry contains our fixture
      expect(res.body.data.unreadInquiries).toBeGreaterThanOrEqual(1); // Because we created isViewed: false in setup
    });
  });

  
  // GET /chart
   
  describe("C. GET /chart", () => {
    it("DASH-CHART-01: Range na pathale (Default 30D, 200)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/chart").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("DASH-CHART-02 & DASH-CHART-03: ?range=7D and ?range=1Y (200)", async () => {
      const res7D = await request(app).get("/api/v1/admin/dashboard/chart?range=7D").set("Authorization", `Bearer ${regularAdminToken}`);
      const res1Y = await request(app).get("/api/v1/admin/dashboard/chart?range=1Y").set("Authorization", `Bearer ${regularAdminToken}`);
      
      expect(res7D.status).toBe(200);
      expect(res1Y.status).toBe(200);
    });

    it("DASH-CHART-04: Invalid range (400)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/chart?range=INVALID").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(400); // Triggered by Zod validation
    });

    it("DASH-CHART-05: Chart result-er shape (Date string, Count number)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/chart?range=30D").set("Authorization", `Bearer ${regularAdminToken}`);
      
      // If records exist, verify the exact format
      if (res.body.data.length > 0) {
        const firstPoint = res.body.data[0];
        expect(typeof firstPoint.count).toBe("number");
        expect(firstPoint.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD
      }
    });
  });

   
  // GET /activity
   
  describe("D. GET /activity", () => {
    it("DASH-ACT-01 & DASH-ACT-02: Activity endpoint valid request returns LEAD, BLOG, PAGE arrays", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/activity").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);

      const types = res.body.data.map(i => i.type);
      expect(types).toContain("LEAD");
      expect(types).toContain("PAGE");
      expect(types).toContain("BLOG");
    });

    it("DASH-ACT-03 & DASH-ACT-04: Combined timeline chronological order and max 10 entries", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/activity").set("Authorization", `Bearer ${regularAdminToken}`);
      const activities = res.body.data;
      
      expect(activities.length).toBeLessThanOrEqual(10);
      
      if (activities.length > 1) {
        const time1 = new Date(activities[0].time).getTime();
        const time2 = new Date(activities[1].time).getTime();
        expect(time1).toBeGreaterThanOrEqual(time2); // Newest first
      }
    });
  });

   
  // GET /recent-entries
   
  describe("E. GET /recent-entries", () => {
    it("DASH-RECENT-01: Limit chara request (Default limit 4, 200)", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/recent-entries").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(4);
    });

    it("DASH-RECENT-02 & DASH-RECENT-05: ?limit=2 returns max 2 and includes form.title", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/recent-entries?limit=2").set("Authorization", `Bearer ${regularAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      
      if (res.body.data.length > 0) {
        expect(res.body.data[0].form).toHaveProperty("title");
      }
    });

    it("DASH-RECENT-Validation: Invalid limits are rejected (400)", async () => {
      const res1 = await request(app).get("/api/v1/admin/dashboard/recent-entries?limit=abc").set("Authorization", `Bearer ${regularAdminToken}`);
      const res2 = await request(app).get("/api/v1/admin/dashboard/recent-entries?limit=0").set("Authorization", `Bearer ${regularAdminToken}`);
      
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });
  });

   
  // GET /export-leads
   
  describe("F. GET /export-leads", () => {
    it("DASH-CSV-01 & DASH-CSV-02: Admin CSV export returns 200 and correct headers", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/export-leads").set("Authorization", `Bearer ${regularAdminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.headers["content-disposition"]).toContain('attachment; filename="leads_export.csv"');
    });

    it("DASH-CSV-03 & DASH-CSV-04: Header and row formatting includes correct columns and handles empty/payload", async () => {
      const res = await request(app).get("/api/v1/admin/dashboard/export-leads").set("Authorization", `Bearer ${regularAdminToken}`);
      
      const lines = res.text.trim().split("\n");
      // Check Header String
      expect(lines[0]).toBe("Form Title,Status,Date Submitted,IP Address,Payload Data");
      
      if (lines.length > 1) {
        const leadRow = lines.find(l => l.includes("Test Lead"));
        expect(leadRow).toBeDefined();
        expect(leadRow).toContain('""name"":""Test Lead""');
      }
    });
  });
});