import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";

describe("Projects API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "ProjectPass123!";
  const createdProjectIds = new Set();
  const createdMediaIds = new Set();
  const testUserIds = new Set();
  const testRoleIds = new Set();

  let actors = {
    super: { email: `super_proj_${runId}@test.com`, token: "" },
    full: { email: `full_proj_${runId}@test.com`, token: "" },
    view: { email: `view_proj_${runId}@test.com`, token: "" },
    none: { email: `none_proj_${runId}@test.com`, token: "" },
  };

  // Shared test variables
  let sampleProjectId = "";
  let sampleProjectSlug = "";
  let draftProjectId = "";
  let draftProjectSlug = "";
  let dummyMediaId = "";

  // IP rotator for rate limits
  let ipCounter = 1;
  const getIp = () => `192.168.120.${ipCounter++}`;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Core System Roles
    const sysAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysSuper = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });

    // Project Permissions
    const perms = ["project.view", "project.create", "project.edit", "project.delete"];
    const permMap = {};
    for (const p of perms) {
      const dbP = await prisma.permission.upsert({ where: { slug: p }, update: { module: "PROJECTS" }, create: { name: p, slug: p, module: "PROJECTS" } });
      permMap[p] = dbP.id;
    }

    // Functional Roles
    const frFull = await prisma.functionalRole.create({
      data: { name: `PRJ_Full_${runId}`, slug: `prj-full-${runId}`, permissions: { create: perms.map(p => ({ permissionId: permMap[p] })) } }
    });
    const frView = await prisma.functionalRole.create({
      data: { name: `PRJ_View_${runId}`, slug: `prj-view-${runId}`, permissions: { create: [{ permissionId: permMap["project.view"] }] } }
    });
    testRoleIds.add(frFull.id).add(frView.id);

    // Test Actors Setup
    const setupActor = async (key, sysRoleId, funcRoleId = null) => {
      const u = await prisma.user.create({
        data: {
          name: `Project Actor ${key}`, email: actors[key].email, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleId,
          functionalRoles: funcRoleId ? { create: [{ functionalRoleId: funcRoleId }] } : undefined
        }
      });
      testUserIds.add(u.id);
    };

    await setupActor("super", sysSuper.id);
    await setupActor("full", sysAdmin.id, frFull.id);
    await setupActor("view", sysAdmin.id, frView.id);
    await setupActor("none", sysAdmin.id);

    // Get Tokens
    for (const key of Object.keys(actors)) {
      const res = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", getIp()).send({ email: actors[key].email, password: rawPassword });
      actors[key].token = res.body.data.accessToken;
    }

    // Create Dummy Media for Image tests
    const dummyMedia = await prisma.media.create({
      data: {
        filename: `dummy_${runId}`, originalName: "dummy.jpg", mimeType: "image/jpeg",
        size: 1024, url: "http://example.com/dummy.jpg", uploadedById: Array.from(testUserIds)[0]
      }
    });
    dummyMediaId = dummyMedia.id;
    createdMediaIds.add(dummyMediaId);
  });

  afterAll(async () => {
    if (createdProjectIds.size > 0) {
      await prisma.project.deleteMany({ where: { id: { in: Array.from(createdProjectIds) } } });
    }
    if (createdMediaIds.size > 0) {
      await prisma.media.deleteMany({ where: { id: { in: Array.from(createdMediaIds) } } });
    }

    const uIds = Array.from(testUserIds);
    if (uIds.length > 0) {
      await prisma.userFunctionalRole.deleteMany({ where: { userId: { in: uIds } } });
      await prisma.refreshToken.deleteMany({ where: { userId: { in: uIds } } });
      await prisma.user.deleteMany({ where: { id: { in: uIds } } });
    }

    const rIds = Array.from(testRoleIds);
    if (rIds.length > 0) {
      await prisma.functionalRolePermission.deleteMany({ where: { functionalRoleId: { in: rIds } } });
      await prisma.functionalRole.deleteMany({ where: { id: { in: rIds } } });
    }

    await prisma.$disconnect();
  });

  const trackProject = (res) => {
    if (res && res.body && res.body.data && res.body.data.id) {
      createdProjectIds.add(res.body.data.id);
    }
    return res;
  };

  // Authentication and RBAC
  describe("A. Authentication & RBAC", () => {
    it("AUTH-01: Token chara admin project list (401)", async () => {
      const res = await request(app).get("/api/v1/admin/projects");
      expect(res.status).toBe(401);
    });

    it("AUTH-02: Invalid bearer token (401)", async () => {
      const res = await request(app).get("/api/v1/admin/projects").set("Authorization", "Bearer invalid");
      expect(res.status).toBe(401);
    });

    it("AUTH-03: Permission chara none actor diye list (403)", async () => {
      const res = await request(app).get("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.none.token}`);
      expect(res.status).toBe(403);
    });

    it("AUTH-04: view actor diye list (200)", async () => {
      const res = await request(app).get("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
    });

    it("AUTH-05: view actor diye project create (403)", async () => {
      const res = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.view.token}`).send({ title: "View Create", category: "Test" });
      expect(res.status).toBe(403);
    });

    it("AUTH-06: view actor diye project update (403)", async () => {
      const res = await request(app).patch("/api/v1/admin/projects/dummy_id").set("Authorization", `Bearer ${actors.view.token}`).send({ title: "Updated" });
      expect(res.status).toBe(403);
    });

    it("AUTH-07: view actor diye project delete (403)", async () => {
      const res = await request(app).delete("/api/v1/admin/projects/dummy_id").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(403);
    });

    it("AUTH-08: SUPER_ADMIN diye admin list (200)", async () => {
      const res = await request(app).get("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.super.token}`);
      expect(res.status).toBe(200);
    });
  });

  // Create Project
  describe("B. Create Project", () => {
    it("CREATE-01 & CREATE-12: Minimum valid payload defaults status to PUBLISHED and persists", async () => {
      const res = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`)
        .send({
        title: `Valid Project ${runId}`,
        category: `Cat_${runId}`,
        location: `Location_${runId}`,
        });
      trackProject(res);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("PUBLISHED");

      const dbRecord = await prisma.project.findUnique({ where: { id: res.body.data.id } });
      expect(dbRecord.title).toBe(`Valid Project ${runId}`);
      expect(dbRecord.category).toBe(`Cat_${runId}`);
      
      sampleProjectId = dbRecord.id;
      sampleProjectSlug = dbRecord.slug;
    });

    it("CREATE-02 & CREATE-03: Title extra spaces trimmed, slug generated from title", async () => {
      const res = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "   Spaces Trimmed   ", category: "Test" });
      trackProject(res);

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Spaces Trimmed");
      expect(res.body.data.slug).toBe("spaces-trimmed");
    });

    it("CREATE-04: Explicit slug normalized", async () => {
      const res = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Explicit Slug", slug: "  MY-SLUG  ", category: "Test" });
      trackProject(res);

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe("my-slug");
    });

    it("CREATE-05: Existing slug generates unique suffix", async () => {
      await trackProject(await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`).send({ title: `Dupe ${runId}`, category: "Test" }));
      const res2 = await trackProject(await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`).send({ title: `Dupe ${runId}`, category: "Test" }));
      
      expect(res2.status).toBe(201);
      expect(res2.body.data.slug).not.toBe(`dupe-${runId}`);
      expect(res2.body.data.slug.startsWith(`dupe-${runId}-`)).toBe(true);
    });

    it("CREATE-06, CREATE-07, CREATE-08, CREATE-09, CREATE-10, CREATE-11: Validation Rejections (400)", async () => {
      const r1 = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`).send({ category: "Test" }); // Missing title
      const r2 = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`).send({ title: "Title" }); // Missing category
      
      const r3 = await request(app)
        .post("/api/v1/admin/projects")
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: "Valid Project Title",
          slug: "bad_slug!",
          category: "Valid Category",
        });
        
      const r4 = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`).send({ title: "A".repeat(151), category: "C" });
      
      const r5 = await request(app)
        .post("/api/v1/admin/projects")
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: "Valid Project Title",
          category: "Valid Category",
          hackField: "Bad",
        });

      const r6 = await request(app)
        .post("/api/v1/admin/projects")
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: "Valid Project Title",
          category: "Valid Category",
          status: "FAKE",
        });

      expect(r1.status).toBe(400);
      expect(r2.status).toBe(400);
      expect(r3.status).toBe(400);
      expect(r4.status).toBe(400);
      expect(r5.status).toBe(400);
      expect(r6.status).toBe(400);
    });
        it("CREATE-13: Unknown image ID returns 400", async () => {
      const res = await request(app)
        .post("/api/v1/admin/projects")
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: `Invalid Image Project ${runId}`,
          category: `InvalidImage_${runId}`,
          featuredImageId: `missing-media-${runId}`,
        });

      expect(
        res.status,
        `Invalid image ID was not rejected: ${JSON.stringify(res.body)}`
      ).toBe(400);
    });

    it("Setup Draft Project for further tests", async () => {
      const res = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Draft Project ${runId}`, category: `Cat_${runId}`, status: "DRAFT" });
      trackProject(res);
      draftProjectId = res.body.data.id;
      draftProjectSlug = res.body.data.slug;
    });
  });

  // Admin Project List
  describe("C. Admin List (Filters & Pagination)", () => {
    it("LIST-01: Default query (200)", async () => {
      const res = await request(app).get("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.page).toBe(1);
    });

    it("LIST-02 & LIST-03: Filter by status", async () => {
      const resDraft = await request(app).get("/api/v1/admin/projects?status=DRAFT").set("Authorization", `Bearer ${actors.full.token}`);
      const resPub = await request(app).get("/api/v1/admin/projects?status=PUBLISHED").set("Authorization", `Bearer ${actors.full.token}`);
      
      expect(resDraft.body.data.every(p => p.status === "DRAFT")).toBe(true);
      expect(resPub.body.data.every(p => p.status === "PUBLISHED")).toBe(true);
    });

    it("LIST-04: Filter by unique category", async () => {
      const res = await request(app).get(`/api/v1/admin/projects?category=Cat_${runId}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2); // The published and draft ones created above
    });

    it("LIST-05: category=All ignores filter", async () => {
      const resAll = await request(app).get("/api/v1/admin/projects?category=All").set("Authorization", `Bearer ${actors.full.token}`);
      const resNone = await request(app).get("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`);
      expect(resAll.body.meta.total).toBe(resNone.body.meta.total);
    });

    it("LIST-06: Pagination meta correct (page=1&limit=2)", async () => {
      const res = await request(app).get("/api/v1/admin/projects?page=1&limit=2").set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.body.meta.limit).toBe(2);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it("LIST-07: Sorting by title ascending works", async () => {
      const res = await request(app)
        .get(
          `/api/v1/admin/projects?category=Cat_${runId}&sortBy=title&sortOrder=asc`
        )
        .set("Authorization", `Bearer ${actors.full.token}`);

      expect(
        res.status,
        `Project sorting failed: ${JSON.stringify(res.body)}`
      ).toBe(200);

      const titles = res.body.data.map((project) => project.title);

      expect(titles).toEqual([
        `Draft Project ${runId}`,
        `Valid Project ${runId}`,
      ]);
    });

    it("LIST-08 & LIST-09: Pagination boundaries and invalid enums reject (400)", async () => {
      const res1 = await request(app).get("/api/v1/admin/projects?page=0").set("Authorization", `Bearer ${actors.full.token}`);
      const res2 = await request(app).get("/api/v1/admin/projects?limit=101").set("Authorization", `Bearer ${actors.full.token}`);
      const res3 = await request(app).get("/api/v1/admin/projects?sortBy=unknownField").set("Authorization", `Bearer ${actors.full.token}`);
      const res4 = await request(app).get("/api/v1/admin/projects?sortOrder=invalidOrder").set("Authorization", `Bearer ${actors.full.token}`);
      
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
      expect(res3.status).toBe(400);
      expect(res4.status).toBe(400);
    });

    it("LIST-10: Search by title/location (Expected to catch Bug #1)", async () => {
      const res = await request(app)
        .get("/api/v1/admin/projects?search=Draft")
        .set("Authorization", `Bearer ${actors.full.token}`);

      expect(
        res.status,
        `Admin search failed: ${JSON.stringify(res.body)}`
      ).toBe(200);

      expect(Array.isArray(res.body.data)).toBe(true);

      expect(
        res.body.data.some((project) =>
          project.title.includes(`Draft Project ${runId}`)
        )
      ).toBe(true);
    });

    it("LIST-11: Search by location and category", async () => {
      const byLocation = await request(app)
        .get(`/api/v1/admin/projects?search=Location_${runId}`)
        .set("Authorization", `Bearer ${actors.full.token}`);

      expect(
        byLocation.status,
        `Location search failed: ${JSON.stringify(byLocation.body)}`
      ).toBe(200);

      expect(
        byLocation.body.data.some(
          (project) => project.id === sampleProjectId
        )
      ).toBe(true);

      const byCategory = await request(app)
        .get(`/api/v1/admin/projects?search=Cat_${runId}`)
        .set("Authorization", `Bearer ${actors.full.token}`);

      expect(
        byCategory.status,
        `Category search failed: ${JSON.stringify(byCategory.body)}`
      ).toBe(200);

      expect(
        byCategory.body.data.some(
          (project) => project.id === sampleProjectId
        )
      ).toBe(true);
    });
  });

  // Get Project by ID
  describe("D. Get by ID", () => {
    it("Existing project returns 200", async () => {
      const res = await request(app).get(`/api/v1/admin/projects/${sampleProjectId}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(sampleProjectId);
    });

    it("Nonexistent but sufficiently long ID (404)", async () => {
      const fakeCuid = "cm0zabcdefghijklmno123456";
      const res = await request(app).get(`/api/v1/admin/projects/${fakeCuid}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(404);
    });

    it("Too short ID format validation (400)", async () => {
      const res = await request(app).get(`/api/v1/admin/projects/abc`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(400);
    });
  });

  // Update Project
  describe("E. Update Project (PATCH /api/v1/admin/projects/:id)", () => {
    it("UPDATE-01: Update title (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/projects/${sampleProjectId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Updated Title Patch" });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Title Patch");
    });

    it("BUG-02: Partial update should preserve existing images", async () => {
      // Set both image relations initially.
      const setImageRes = await request(app)
        .patch(`/api/v1/admin/projects/${sampleProjectId}`)
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          featuredImageId: dummyMediaId,
          heroImageId: dummyMediaId,
        });

      expect(
        setImageRes.status,
        `Setting project images failed: ${JSON.stringify(setImageRes.body)}`
      ).toBe(200);

      const beforeUpdate = await prisma.project.findUnique({
        where: { id: sampleProjectId },
      });

      expect(beforeUpdate.featuredImageId).toBe(dummyMediaId);
      expect(beforeUpdate.heroImageId).toBe(dummyMediaId);

      // Update only the title.
      const patchRes = await request(app)
        .patch(`/api/v1/admin/projects/${sampleProjectId}`)
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: "Title Change No Image Change",
        });

      expect(
        patchRes.status,
        `Partial update failed: ${JSON.stringify(patchRes.body)}`
      ).toBe(200);

      // Verify both image associations are preserved in the database.
      const afterUpdate = await prisma.project.findUnique({
        where: { id: sampleProjectId },
      });

      expect(afterUpdate.featuredImageId).toBe(dummyMediaId);
      expect(afterUpdate.heroImageId).toBe(dummyMediaId);
    });

    it("UPDATE-IMAGE-03: Explicit null clears only the selected image", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/projects/${sampleProjectId}`)
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({ featuredImageId: null });

      expect(
        res.status,
        `Clearing image failed: ${JSON.stringify(res.body)}`
      ).toBe(200);

      const dbRecord = await prisma.project.findUnique({
        where: { id: sampleProjectId },
      });

      expect(dbRecord.featuredImageId).toBeNull();
      expect(dbRecord.heroImageId).toBe(dummyMediaId);
    });

    it("UPDATE-IMAGE-04: Unknown image ID returns 400 without changing images", async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/projects/${sampleProjectId}`)
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({ featuredImageId: `missing-media-${runId}` });

      expect(
        res.status,
        `Invalid image update was not rejected: ${JSON.stringify(res.body)}`
      ).toBe(400);

      const dbRecord = await prisma.project.findUnique({
        where: { id: sampleProjectId },
      });

      expect(dbRecord.featuredImageId).toBeNull();
      expect(dbRecord.heroImageId).toBe(dummyMediaId);
    });

    it("UPDATE-02: Category is preserved on title update", async () => {
      const dbRecord = await prisma.project.findUnique({ where: { id: sampleProjectId } });
      expect(dbRecord.category).toBe(`Cat_${runId}`);
    });

    it("UPDATE-03: Normalized slug saves successfully", async () => {
      const res = await request(app).patch(`/api/v1/admin/projects/${sampleProjectId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ slug: "  NEW-SLUG-TEST  " });
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe("new-slug-test");
      sampleProjectSlug = "new-slug-test"; 
    });

    it("UPDATE-04: Duplicate slug belonging to another project (400)", async () => {
      // Trying to take the draft's slug
      const res = await request(app).patch(`/api/v1/admin/projects/${sampleProjectId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ slug: draftProjectSlug });
      expect(res.status).toBe(400);
    });

    it("UPDATE-05 & UPDATE-06: Nonexistent ID (404) and Invalid Body Key (400)", async () => {
      const res1 = await request(app).patch(`/api/v1/admin/projects/cm0zabcdefghijklmno123456`).set("Authorization", `Bearer ${actors.full.token}`).send({ title: "T" });
      const res2 = await request(app).patch(`/api/v1/admin/projects/${sampleProjectId}`).set("Authorization", `Bearer ${actors.full.token}`).send({ hackField: "Bad" });
      expect(res1.status).toBe(404);
      expect(res2.status).toBe(400);
    });

    it("UPDATE-07: Explicit status change", async () => {
      const res = await request(app).patch(`/api/v1/admin/projects/${draftProjectId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ status: "PUBLISHED" });
      expect(res.status).toBe(200);
      
      const dbRecord = await prisma.project.findUnique({ where: { id: draftProjectId } });
      expect(dbRecord.status).toBe("PUBLISHED");
      
      await prisma.project.update({ where: { id: draftProjectId }, data: { status: "DRAFT" } });
    });
  });

  // Public Project API
  describe("G. Public Project API", () => {
    it("PUBLIC: Public list returns 200 and only PUBLISHED projects", async () => {
      const res = await request(app).get("/api/v1/projects");
      expect(res.status).toBe(200);
      expect(res.body.data.every(p => p.status === "PUBLISHED")).toBe(true);
      
      expect(
        res.body.data.some((project) => project.id === sampleProjectId)
      ).toBe(true);
      expect(
        res.body.data.some((project) => project.id === draftProjectId)
      ).toBe(false);
    });

    it("PUBLIC: Forcing status=DRAFT still returns PUBLISHED (Security Boundary)", async () => {
      const res = await request(app).get("/api/v1/projects?status=DRAFT");
      expect(res.status).toBe(200);
      expect(res.body.data.every(p => p.status === "PUBLISHED")).toBe(true); // Controller forces PUBLISHED
      
      expect(
        res.body.data.some((project) => project.id === sampleProjectId)
      ).toBe(true);
      expect(
        res.body.data.some((project) => project.id === draftProjectId)
      ).toBe(false);
    });

    it("PUBLIC: Detail by slug returns 200 for PUBLISHED project", async () => {
      const res = await request(app).get(`/api/v1/projects/${sampleProjectSlug}`);
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe(sampleProjectSlug);
    });

    it("PUBLIC: Detail by draft slug returns 404", async () => {
      const res = await request(app).get(`/api/v1/projects/${draftProjectSlug}`);
      expect(res.status).toBe(404);
    });

    it("PUBLIC: Detail by unknown slug returns 404", async () => {
      const res = await request(app).get("/api/v1/projects/nonexistent-slug-xyz");
      expect(res.status).toBe(404);
    });

    it("PUBLIC: Archived project detail returns 404", async () => {
      const createRes = await request(app).post("/api/v1/admin/projects").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Archived Pub ${runId}`, category: "ArchivedCat", status: "ARCHIVED" });
      trackProject(createRes);
      
      const res = await request(app).get(`/api/v1/projects/${createRes.body.data.slug}`);
      expect(res.status).toBe(404);
    });

    it("PUBLIC: Search returns the matching published project", async () => {
      const res = await request(app).get(
        `/api/v1/projects?search=${encodeURIComponent(
          "Title Change No Image Change"
        )}`
      );

      expect(
        res.status,
        `Public search failed: ${JSON.stringify(res.body)}`
      ).toBe(200);

      expect(Array.isArray(res.body.data)).toBe(true);

      expect(
        res.body.data.some((project) => project.id === sampleProjectId)
      ).toBe(true);
    });
  });

  // Delete Project
  describe("F. Delete Project", () => {
    it("DELETE: Unknown project ID returns 404", async () => {
      const res = await request(app).delete("/api/v1/admin/projects/cm0zabcdefghijklmno123456").set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(404);
    });

    it("DELETE: View actor cannot delete (403)", async () => {
      const res = await request(app).delete(`/api/v1/admin/projects/${draftProjectId}`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(403);
    });

    it("DELETE: Hard delete successfully removes the project", async () => {
      const res = await request(app).delete(`/api/v1/admin/projects/${draftProjectId}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);

      const dbRecord = await prisma.project.findUnique({ where: { id: draftProjectId } });
      expect(dbRecord).toBeNull();
      
      createdProjectIds.delete(draftProjectId);
    });

    it("DELETE: Admin detail request for deleted project returns 404", async () => {
      const res = await request(app).get(`/api/v1/admin/projects/${draftProjectId}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(404);
    });
  });
});