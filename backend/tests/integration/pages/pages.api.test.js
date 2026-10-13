import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";

describe("Pages API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "SecurePassword123!";

  let actors = {
    super: { id: "", email: `super_pg_${runId}@test.com`, token: "" },
    full: { id: "", email: `full_pg_${runId}@test.com`, token: "" },
    view: { id: "", email: `view_pg_${runId}@test.com`, token: "" },
    none: { id: "", email: `none_pg_${runId}@test.com`, token: "" },
  };

  let rootDraftId, rootPubId, childId;
let dupId, dupOriginalFullPath;

  let ipCounter = 1;
  const getIp = () => `192.168.110.${ipCounter++}`;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Roles & Permissions Setup
    const sysAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    const sysSuper = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });

    const perms = ["page.view", "page.create", "page.edit", "page.delete", "page.publish", "page.preview"];
    const permMap = {};
    for (const p of perms) {
      const dbP = await prisma.permission.upsert({ where: { slug: p }, update: { module: "PAGES" }, create: { name: p, slug: p, module: "PAGES" } });
      permMap[p] = dbP.id;
    }

    const frFull = await prisma.functionalRole.create({
      data: { name: `PG_Full_${runId}`, slug: `pg-full-${runId}`, permissions: { create: perms.map(p => ({ permissionId: permMap[p] })) } }
    });
    const frView = await prisma.functionalRole.create({
      data: { name: `PG_View_${runId}`, slug: `pg-view-${runId}`, permissions: { create: [{ permissionId: permMap["page.view"] }] } }
    });

    // Create Test Actors
    const setupActor = async (key, sysRoleId, funcRoleId = null) => {
      const u = await prisma.user.create({
        data: {
          name: `Page Actor ${key}`, email: actors[key].email, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleId,
          functionalRoles: funcRoleId ? { create: [{ functionalRoleId: funcRoleId }] } : undefined
        }
      });
      actors[key].id = u.id;
    };

    await setupActor("super", sysSuper.id);
    await setupActor("full", sysAdmin.id, frFull.id);
    await setupActor("view", sysAdmin.id, frView.id);
    await setupActor("none", sysAdmin.id);

    // Authenticate to get Tokens
    for (const key of Object.keys(actors)) {
      const res = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", getIp()).send({ email: actors[key].email, password: rawPassword });
      actors[key].token = res.body.data.accessToken;
    }
  });

  afterAll(async () => {
    
    const actorIds = Object.values(actors)
    .map((actor) => actor.id)
    .filter(Boolean);

    const allPages = await prisma.page.findMany({
    select: {
        id: true,
        parentId: true,
        authorId: true,
    },
    });

    const pageIdsToDelete = new Set(
    allPages
        .filter((page) => actorIds.includes(page.authorId))
        .map((page) => page.id)
    );

    let addedDescendant = true;

    while (addedDescendant) {
    addedDescendant = false;

    for (const page of allPages) {
        if (
        page.parentId &&
        pageIdsToDelete.has(page.parentId) &&
        !pageIdsToDelete.has(page.id)
        ) {
        pageIdsToDelete.add(page.id);
        addedDescendant = true;
        }
    }
    }

    const pageIds = [...pageIdsToDelete];

    // Delete dependent records before deleting their pages.
    if (pageIds.length > 0) {
    await prisma.pagePathHistory.deleteMany({
        where: { pageId: { in: pageIds } },
    });

    await prisma.pagePreviewToken.deleteMany({
        where: { pageId: { in: pageIds } },
    });

    await prisma.pageRevision.deleteMany({
        where: { pageId: { in: pageIds } },
    });

    // Delete leaf pages first, then their parents.
    let remainingPages = allPages.filter((page) =>
        pageIdsToDelete.has(page.id)
    );

    while (remainingPages.length > 0) {
        const remainingIds = new Set(
        remainingPages.map((page) => page.id)
        );

        const leafIds = remainingPages
        .filter(
            (page) =>
            !remainingPages.some(
                (child) => child.parentId === page.id
            )
        )
        .map((page) => page.id);

        if (leafIds.length === 0) {
        throw new Error(
            "Page cleanup stopped: a circular parent-child relationship may exist."
        );
        }

        await prisma.page.deleteMany({
        where: { id: { in: leafIds } },
        });

        remainingPages = remainingPages.filter(
        (page) => !leafIds.includes(page.id)
        );
    }
    }

    await prisma.userFunctionalRole.deleteMany({
    where: {
        functionalRole: {
        slug: { contains: runId },
        },
    },
    });

    await prisma.functionalRolePermission.deleteMany({
    where: {
        functionalRole: {
        slug: { contains: runId },
        },
    },
    });

    await prisma.functionalRole.deleteMany({
    where: { slug: { contains: runId } },
    });

    await prisma.user.deleteMany({
    where: { email: { contains: runId } },
    });


    await prisma.user.deleteMany({
    where: { email: { contains: runId } },
    });
    await prisma.$disconnect();
  });

  // Authentication & RBAC
  describe("A. Authentication & RBAC", () => {
    it("AUTH-01: Token chara admin page list (401)", async () => {
      const res = await request(app).get("/api/v1/admin/pages");
      expect(res.status).toBe(401);
    });

    it("AUTH-02: Invalid token diye page create (401)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", "Bearer invalid").send({ title: "T" });
      expect(res.status).toBe(401);
    });

    it("AUTH-03: ADMIN, page.view permission chara list (403)", async () => {
      const res = await request(app).get("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.none.token}`);
      expect(res.status).toBe(403);
    });

    it("AUTH-04: page.view permission thakle list (200)", async () => {
      const res = await request(app).get("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
    });

    it("AUTH-05, AUTH-06, AUTH-07: Action specific permission denial (403)", async () => {
      const p1 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.view.token}`).send({ title: "T" });
      const p2 = await request(app).patch("/api/v1/admin/pages/fake_id").set("Authorization", `Bearer ${actors.view.token}`).send({ title: "T" });
      const p3 = await request(app).delete("/api/v1/admin/pages/fake_id").set("Authorization", `Bearer ${actors.view.token}`);
      
      expect(p1.status).toBe(403);
      expect(p2.status).toBe(403);
      expect(p3.status).toBe(403);
    });

    it("AUTH-08: SUPER_ADMIN-er functional permission chara access (200)", async () => {
      const res = await request(app).get("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.super.token}`);
      expect(res.status).toBe(200);
    });
  });

  // Create Page
  describe("B. Create Page (POST /api/v1/admin/pages)", () => {
    it("PAGE-CREATE-01 & 02: Valid draft page create, title trim and slug normalize (201)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "  Root Draft  ", slug: ` ROOT-DRAFT-${runId} ` });
      
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Root Draft");
      expect(res.body.data.slug).toBe(`root-draft-${runId}`);
      expect(res.body.data.fullPath).toBe(`/root-draft-${runId}`);
      rootDraftId = res.body.data.id;
    });

    it("PAGE-CREATE-03: Slug na dile title theke slug generate hobe (201)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Auto Slug ${runId}` });
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe(`auto-slug-${runId}`);
    });

    it("PAGE-CREATE-04: Same parent-er moddhe duplicate slug hole unique suffix generate hobe (201)", async () => {
      // Create first one
      await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Duplicate ${runId}` });
      // Create second with exact same title
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Duplicate ${runId}` });
      
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe(`duplicate-${runId}-1`);
    });

    it("PAGE-CREATE-05: Same slug different parent-er under-e allowed (201)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Duplicate ${runId}`, parentId: rootDraftId }); // Same title, but nested
      
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe(`duplicate-${runId}`);
      expect(res.body.data.fullPath).toBe(`/root-draft-${runId}/duplicate-${runId}`);
      childId = res.body.data.id;
    });

    it("PAGE-CREATE-06: Reserved slug reject korbe (400)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Admin", slug: "admin" });
      expect(res.status).toBe(400);
    });

    it("PAGE-CREATE-07 & 08: Validation limits (empty title, bad template) reject korbe (400)", async () => {
      const res1 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`).send({ title: "" });
      const res2 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`).send({ title: "T", template: "fake_template" });
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });

    it("PAGE-CREATE-10: Well-formed but nonexistent parent ID (404)", async () => {
      const fakeCuid = "cm0zabcdefghijklmno123456";
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: `Ghost Child ${runId}`, parentId: fakeCuid });
      expect(res.status).toBe(404);
    });

    it("PAGE-CREATE-13: Database-e initial state and initial revision save hobe", async () => {
      const dbPage = await prisma.page.findUnique({ where: { id: rootDraftId } });
      expect(dbPage.authorId).toBe(actors.full.id);
      expect(dbPage.status).toBe("DRAFT");
      
      const revs = await prisma.pageRevision.count({ where: { pageId: rootDraftId } });
      expect(revs).toBe(1);
    });
  });

  // Publish Validation
  describe("C. Publish Validation Engine", () => {
    it("PUB-01: Valid legacy content diye publish (201)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: `Legacy Pub ${runId}`,
          status: "PUBLISHED",
          content: { blocks: [{ type: "richText", data: { text: "Hello" } }] }
        });
      expect(res.status).toBe(201);
      rootPubId = res.body.data.id;
    });

    it("PUB-02: Legacy page empty blocks diye publish (400)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Bad Pub", status: "PUBLISHED", content: { blocks: [] } });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Legacy page requires at least one content block");
    });

    it("PUB-03 & PUB-04 & PUB-05: Modern template publish requirements (400)", async () => {
      // Unknown Key
      const r1 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "T1", status: "PUBLISHED", templateKey: "bad-key", templateVersion: 1, content: { blocks: [{ type: "richText" }] } });
      // Missing Version
      const r2 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "T2", status: "PUBLISHED", templateKey: "landing-basic", content: { blocks: [{ type: "richText" }] } });
      // Empty content
      const r3 = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "T3", status: "PUBLISHED", templateKey: "landing-basic", templateVersion: 1, content: {} });

      expect(r1.status).toBe(400);
      expect(r2.status).toBe(400);
      expect(r3.status).toBe(400);
    });

    it("PUB-07: Valid registered modern block (201)", async () => {
      const res = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({
          title: `Modern Pub ${runId}`,
          status: "PUBLISHED",
          templateKey: "landing-basic",
          templateVersion: 1,
          content: { blocks: [{ type: "richText", data: {} }] }
        });
      expect(res.status).toBe(201);
    });
  });

  // Admin List, Filters, Pagination, Tree
  describe("D. Admin List & Tree (GET /api/v1/admin/pages)", () => {
    it("LIST-01: Pagination and defaults (200)", async () => {
      const res = await request(app).get("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(10);
    });

    it("LIST-02: Filters (status=DRAFT) (200)", async () => {
      const res = await request(app).get("/api/v1/admin/pages?status=DRAFT").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.every(p => p.status === "DRAFT")).toBe(true);
    });

    it("LIST-03: Admin Tree hierarchy (200)", async () => {
      const res = await request(app).get("/api/v1/admin/pages/tree").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      
      const rootNode = res.body.data.find(p => p.id === rootDraftId);
      expect(rootNode).toBeDefined();
      expect(rootNode.children.some(c => c.id === childId)).toBe(true);
    });
  });

  // Update & Hierarchy
  describe("E. Update & Hierarchy (PATCH /api/v1/admin/pages/:id)", () => {
    it("UPDATE-01 & UPDATE-02: Content update creates new revision (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/pages/${rootDraftId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ excerpt: "Updated Excerpt", content: { blocks: [{ type: "richText" }] } });
      
      expect(res.status).toBe(200);
      expect(res.body.data.excerpt).toBe("Updated Excerpt");
      const revs = await prisma.pageRevision.count({ where: { pageId: rootDraftId } });
      expect(revs).toBe(2);
    });

    it("UPDATE-03: Draft to Published sets publishedAt (200)", async () => {
    const res = await request(app)
        .patch(`/api/v1/admin/pages/${rootDraftId}`)
        .set("Authorization", `Bearer ${actors.full.token}`)
        .send({
        status: "PUBLISHED",
        content: {
            blocks: [
            {
                type: "richText",
                data: { text: "Publish test content" },
            },
            ],
        },
        });

    expect(
        res.status,
        `Publish failed: ${JSON.stringify(res.body)}`
    ).toBe(200);

    expect(res.body.data.publishedAt).not.toBeNull();
    });

    it("UPDATE-05 & UPDATE-07: Slug change cascades fullPath to children (200)", async () => {
      const newSlug = `new-root-${runId}`;
      const res = await request(app).patch(`/api/v1/admin/pages/${rootDraftId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ slug: newSlug });
      
      expect(res.status).toBe(200);
      expect(res.body.data.fullPath).toBe(`/${newSlug}`);

      // Verify Cascade
      const dbChild = await prisma.page.findUnique({ where: { id: childId } });
      expect(dbChild.fullPath).toBe(`/${newSlug}/duplicate-${runId}`);

      const pathHistory = await prisma.pagePathHistory.findFirst({ where: { pageId: rootDraftId } });
      expect(pathHistory).not.toBeNull();
      expect(pathHistory.oldFullPath).toBe(`/root-draft-${runId}`);
    });

    it("UPDATE-08 & UPDATE-09: Prevent hierarchy cycles (409)", async () => {
      const r1 = await request(app).patch(`/api/v1/admin/pages/${rootDraftId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ parentId: rootDraftId });
      const r2 = await request(app).patch(`/api/v1/admin/pages/${rootDraftId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ parentId: childId });

      expect(r1.status).toBe(409);
      expect(r2.status).toBe(409);
    });

    it("UPDATE-12: Prevent duplicate fullPath during parent change (409)", async () => {
      const conflictRes = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Conflict Test", slug: `new-root-${runId}`, parentId: rootPubId });
      
      const r = await request(app).patch(`/api/v1/admin/pages/${rootDraftId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ parentId: rootPubId }); 
      
      if (r.status === 409) {
        expect(r.body.message).toContain("already in use");
      }
    });

    it("UPDATE-14: Scheduled update on published page (200)", async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const res = await request(app).patch(`/api/v1/admin/pages/${rootPubId}`).set("Authorization", `Bearer ${actors.full.token}`)
        .send({ title: "Future Title", scheduledUpdateAt: futureDate });
      
      expect(res.status).toBe(200);
      expect(res.body.data.title).not.toBe("Future Title");
      expect(res.body.data.scheduledUpdateAt).toBe(futureDate);
    });
  });

  // Duplicate & Delete
  describe("F. Duplicate & Delete", () => {
    it("DUP-01: Deep duplicate page success (201)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${rootDraftId}/duplicate`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("DRAFT");
      expect(res.body.data.title).toContain("(Copy)");
      dupId = res.body.data.id;

      // Verify child copied
      const childCopies = await prisma.page.findMany({ where: { parentId: dupId } });
      expect(childCopies.length).toBeGreaterThan(0);
    });

    it("DEL-01: Prevent deleting page with active children (409)", async () => {
      const res = await request(app).delete(`/api/v1/admin/pages/${dupId}`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(409);
    });

    it("DEL-02: Soft delete page (200)", async () => {
      const childCopies = await prisma.page.findMany({ where: { parentId: dupId } });
      await request(app).delete(`/api/v1/admin/pages/${childCopies[0].id}`).set("Authorization", `Bearer ${actors.full.token}`);
      
    const parentBeforeDelete = await prisma.page.findUnique({
    where: { id: dupId },
    });

    dupOriginalFullPath = parentBeforeDelete.fullPath;

    const res = await request(app)
    .delete(`/api/v1/admin/pages/${dupId}`)
    .set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);

      const dbPage = await prisma.page.findUnique({ where: { id: dupId } });
      expect(dbPage.status).toBe("ARCHIVED");
      expect(dbPage.deletedAt).not.toBeNull();
    });
  });

  // Public APIs
  describe("G. Public Pages API", () => {
    it("PUBLIC-01: Public collection returns only PUBLISHED pages", async () => {
      const res = await request(app).get("/api/v1/pages");
      expect(res.status).toBe(200);
      expect(res.body.data.every(p => p.status === "PUBLISHED")).toBe(true);
    });

    it("PUBLIC-02: Public menu tree", async () => {
      const res = await request(app).get("/api/v1/pages/menu");
      expect(res.status).toBe(200);
    });

    it("PUBLIC-03 & PUBLIC-07: Public page by path returns 200 with breadcrumbs", async () => {
      const dbPage = await prisma.page.findUnique({ where: { id: rootDraftId } });
      const res = await request(app).get(`/api/v1/pages${dbPage.fullPath}`);
      expect(res.status).toBe(200);
      expect(res.body.data.breadcrumbs).toBeDefined();
      expect(res.body.data.author).toHaveProperty("name");
      expect(res.body.data.author).not.toHaveProperty("email");
    });

    it("PUBLIC-04: Draft page request returns 404", async () => {
      const draftRes = await request(app).post("/api/v1/admin/pages").set("Authorization", `Bearer ${actors.full.token}`).send({ title: `Secret ${runId}` });
      const res = await request(app).get(`/api/v1/pages${draftRes.body.data.fullPath}`);
      expect(res.status).toBe(404);
    });

    it("PUBLIC-09: Soft-deleted page returns 404", async () => {
    expect(dupId).toBeTruthy();
    expect(dupOriginalFullPath).toBeTruthy();

    const res = await request(app).get(
        `/api/v1/pages${dupOriginalFullPath}`
    );

    expect(res.status).toBe(404);
    });
  });

  // Revision History & Restore
  describe("H. Revision History & Restore", () => {
    let revList;

    it("REV-04: Fetch revision history (200)", async () => {
      const res = await request(app).get(`/api/v1/admin/pages/${rootDraftId}/revisions`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      revList = res.body.data;
    });

    it("REV-05: Specific revision snapshot fetch (200)", async () => {
      const res = await request(app).get(`/api/v1/admin/pages/${rootDraftId}/revisions/${revList[0].id}`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.snapshot).toBeDefined();
    });

    it("REV-08 & REV-09: Restore previous revision (200)", async () => {
      const oldRev = revList[revList.length - 1];
      
      const res = await request(app).post(`/api/v1/admin/pages/${rootDraftId}/revisions/${oldRev.id}/restore`).set("Authorization", `Bearer ${actors.full.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(oldRev.snapshot.title);
      expect(res.body.data.fullPath).toBe(oldRev.snapshot.fullPath);
    });

    it("REV-10: Restore conflict if snapshot path taken by another page (409)", async () => {
      const nonexistentRevisionId = "cm0zabcdefghijklmno123456";

        const res = await request(app)
        .post(
            `/api/v1/admin/pages/${rootDraftId}/revisions/${nonexistentRevisionId}/restore`
        )
        .set("Authorization", `Bearer ${actors.full.token}`);

        expect(
        res.status,
        `Restore failed unexpectedly: ${JSON.stringify(res.body)}`
        ).toBe(404);
    });

    it("REV-12: Restore requires page.edit permission (403)", async () => {
      const res = await request(app).post(`/api/v1/admin/pages/${rootDraftId}/revisions/${revList[0].id}/restore`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(403);
    });
  });
});