import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";

describe("Roles API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "IntegrationPass123!";

  // Cached Tokens
  let superAdminToken = "";
  let fullAdminToken = "";
  let viewAdminToken = "";
  let noneAdminToken = "";

  // Core Permissions Maps
  let permMap = {};

  // Trackers for dynamic tests
  let deletedRoleCuid = "";
  let deletedPermCuid = "";
  let assignedRoleId = "";

  beforeAll(async () => {
    const systemRoles = {
      SUPER_ADMIN: await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } }),
      ADMIN: await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } })
    };

    // Ensure Core Permissions exist
    const permsToEnsure = [
      { name: "View Roles", slug: "role.view", module: "ROLES" },
      { name: "Create Role", slug: "role.create", module: "ROLES" },
      { name: "Edit Role", slug: "role.edit", module: "ROLES" },
      { name: "Delete Role", slug: "role.delete", module: "ROLES" }
    ];

    for (const p of permsToEnsure) {
      const dbPerm = await prisma.permission.upsert({
        where: { slug: p.slug },
        update: { module: p.module },
        create: p
      });
      permMap[p.slug] = dbPerm.id;
    }

    // Generate a deleted permission CUID for CREATE-07
    const tempPerm = await prisma.permission.create({ data: { name: `temp_${runId}`, slug: `temp_${runId}`, module: "TEMP" } });
    deletedPermCuid = tempPerm.id;
    await prisma.permission.delete({ where: { id: deletedPermCuid } });

    // Generate a deleted role CUID for DETAIL-03
    const tempRole = await prisma.functionalRole.create({ data: { name: `temp_role_${runId}`, slug: `temp_role_${runId}` } });
    deletedRoleCuid = tempRole.id;
    await prisma.functionalRole.delete({ where: { id: deletedRoleCuid } });

    // Create Functional Roles for Test Actors
    const fullRole = await prisma.functionalRole.create({
      data: {
        name: `Full Role ${runId}`,
        slug: `full-role-${runId}`,
        permissions: {
          create: [
            { permissionId: permMap["role.view"] },
            { permissionId: permMap["role.create"] },
            { permissionId: permMap["role.edit"] },
            { permissionId: permMap["role.delete"] }
          ]
        }
      }
    });

    const viewRole = await prisma.functionalRole.create({
      data: {
        name: `View Role ${runId}`,
        slug: `view-role-${runId}`,
        permissions: {
          create: [{ permissionId: permMap["role.view"] }]
        }
      }
    });

    const assignRole = await prisma.functionalRole.create({ data: { name: `Assigned ${runId}`, slug: `assigned-${runId}` } });
    assignedRoleId = assignRole.id;

    // Create Test Actors
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    
    const usersData = [
      { key: "super", email: `super_${runId}@test.com`, systemRoleId: systemRoles.SUPER_ADMIN.id, funcRoles: [] },
      { key: "full", email: `full_${runId}@test.com`, systemRoleId: systemRoles.ADMIN.id, funcRoles: [fullRole.id] },
      { key: "view", email: `view_${runId}@test.com`, systemRoleId: systemRoles.ADMIN.id, funcRoles: [viewRole.id] },
      { key: "none", email: `none_${runId}@test.com`, systemRoleId: systemRoles.ADMIN.id, funcRoles: [] },
      { key: "assigned", email: `dummy_assigned_${runId}@test.com`, systemRoleId: systemRoles.ADMIN.id, funcRoles: [assignedRoleId] }
    ];

    for (const u of usersData) {
      await prisma.user.create({
        data: {
          name: `User ${u.key}`,
          email: u.email,
          password: passwordHash,
          status: "ACTIVE",
          systemRoleId: u.systemRoleId,
          functionalRoles: u.funcRoles.length > 0 ? {
            create: u.funcRoles.map(rid => ({ functionalRoleId: rid }))
          } : undefined
        }
      });
    }

    // Login to retrieve tokens embedding the permissions
    const loginAndGetToken = async (email) => {
      const res = await request(app).post("/api/v1/auth/admin-login").send({ email, password: rawPassword });
      return res.body.data.accessToken;
    };

    superAdminToken = await loginAndGetToken(`super_${runId}@test.com`);
    fullAdminToken = await loginAndGetToken(`full_${runId}@test.com`);
    viewAdminToken = await loginAndGetToken(`view_${runId}@test.com`);
    noneAdminToken = await loginAndGetToken(`none_${runId}@test.com`);
  });

  afterAll(async () => {
    await prisma.userFunctionalRole.deleteMany({ where: { user: { email: { contains: runId } } } });
    await prisma.user.deleteMany({ where: { email: { contains: runId } } });
    await prisma.functionalRolePermission.deleteMany({ where: { functionalRole: { slug: { contains: runId } } } });
    await prisma.functionalRole.deleteMany({ where: { slug: { contains: runId } } });
    await prisma.$disconnect();
  });

  // Authentication & Permission Boundaries
  describe("A. Authentication and Permission Boundaries", () => {
    it("AUTH-01: Token chara roles list request (401)", async () => {
      const res = await request(app).get("/api/v1/admin/roles");
      expect(res.status).toBe(401);
    });

    it("AUTH-02: Valid ADMIN token ache, kintu kono permission nei (403)", async () => {
      const res = await request(app).get("/api/v1/admin/roles").set("Authorization", `Bearer ${noneAdminToken}`);
      expect(res.status).toBe(403);
    });

    it("AUTH-03: SUPER_ADMIN token, functional permission assign kora nei, bypass kaj korbe (200)", async () => {
      const res = await request(app).get("/api/v1/admin/roles").set("Authorization", `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
    });

    it("AUTH-04: Sudhu role.view thaka user diye role create (403)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${viewAdminToken}`).send({ name: `Hack ${runId}` });
      expect(res.status).toBe(403);
    });

    it("AUTH-05: Sudhu role.view thaka user diye role update (403)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${deletedRoleCuid}`).set("Authorization", `Bearer ${viewAdminToken}`).send({ name: "Hacked" });
      expect(res.status).toBe(403);
    });

    it("AUTH-06: Sudhu role.view thaka user diye role delete (403)", async () => {
      const res = await request(app).delete(`/api/v1/admin/roles/${deletedRoleCuid}`).set("Authorization", `Bearer ${viewAdminToken}`);
      expect(res.status).toBe(403);
    });
  });

  // System Permissions List
  describe("B. System Permissions List (GET /api/v1/admin/roles/permissions)", () => {
    it("PERM-01: role.view permission diye permission list fetch (200)", async () => {
      const res = await request(app).get("/api/v1/admin/roles/permissions").set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const rolesModule = res.body.data["ROLES"];
      expect(rolesModule).toBeDefined();
      expect(rolesModule.some(p => p.slug === "role.view")).toBe(true);
      expect(rolesModule.some(p => p.slug === "role.create")).toBe(true);
      expect(rolesModule.some(p => p.slug === "role.edit")).toBe(true);
      expect(rolesModule.some(p => p.slug === "role.delete")).toBe(true);
    });

    it("PERM-02: Permission chara permissions endpoint access (403)", async () => {
      const res = await request(app).get("/api/v1/admin/roles/permissions").set("Authorization", `Bearer ${noneAdminToken}`);
      expect(res.status).toBe(403);
    });
  });

  // Roles List
  describe("C. Roles List (GET /api/v1/admin/roles)", () => {
    it("LIST-01: Authorized admin roles list pabe (200)", async () => {
      const res = await request(app).get("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      
      const sampleRole = res.body.data.find(r => r.name === `Full Role ${runId}`);
      expect(sampleRole).toBeDefined();
      expect(sampleRole).toHaveProperty("slug");
      expect(sampleRole).toHaveProperty("_count");
      expect(sampleRole._count).toHaveProperty("users");
    });
  });

  // Role Details
  describe("D. Role Details (GET /api/v1/admin/roles/:id)", () => {
    let testRoleId;
    beforeAll(async () => {
      const r = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: `DetailTest ${runId}`, permissionIds: [permMap["role.view"]] });
      testRoleId = r.body.data.id;
    });

    it("DETAIL-01: Existing role ID diye details fetch (200)", async () => {
      const res = await request(app).get(`/api/v1/admin/roles/${testRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testRoleId);
      expect(res.body.data.permissions).toContain(permMap["role.view"]);
    });

    it("DETAIL-02: Invalid CUID format (400)", async () => {
      const res = await request(app).get("/api/v1/admin/roles/invalid_id").set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(400);
    });

    it("DETAIL-03: Valid format kintu database-e nei emon ID (404)", async () => {
      const res = await request(app).get(`/api/v1/admin/roles/${deletedRoleCuid}`).set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(404);
    });
  });

  // Create Functional Role
  describe("E. Create Functional Role (POST /api/v1/admin/roles)", () => {
    it("CREATE-01: Valid name, permissionIds na pathiye role create (201)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: `NoPerm ${runId}` });
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe(`noperm-${runId}`);
    });

    it("CREATE-02: Valid permission IDs diye role create (201)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `WithPerm ${runId}`, permissionIds: [permMap["role.view"], permMap["role.create"]] });
      expect(res.status).toBe(201);
      
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: res.body.data.id }, include: { permissions: true } });
      expect(dbRole.permissions.length).toBe(2);
    });

    it("CREATE-03: Duplicate role name/slug (409)", async () => {
      await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: `Duplicate ${runId}` });
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: `Duplicate ${runId}` });
      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already exists");
    });

    it("CREATE-04: 2 character-er cheye chhoto name (400)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: "A" });
      expect(res.status).toBe(400);
    });

    it("CREATE-05: Ekoi permission ID duibar pathano (400)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `DoublePerm ${runId}`, permissionIds: [permMap["role.view"], permMap["role.view"]] });
      expect(res.status).toBe(400);
    });

    it("CREATE-06: Malformed permission ID (400)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `BadPerm ${runId}`, permissionIds: ["not-a-cuid"] });
      expect(res.status).toBe(400);
    });

    it("CREATE-07: Valid CUID format, kintu nonexistent permission ID (400)", async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `GhostPerm ${runId}`, permissionIds: [deletedPermCuid] });
      expect(res.status).toBe(400);
    });
  });

  // Update Functional Role
  describe("F. Update Functional Role (PATCH /api/v1/admin/roles/:id)", () => {
    let targetRoleId;
    let targetRoleSlug;
    
    beforeAll(async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `Update Target ${runId}`, permissionIds: [permMap["role.view"]] });
      targetRoleId = res.body.data.id;
      targetRoleSlug = res.body.data.slug;
    });

    it("UPDATE-01: Role name ebong description update (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `Updated Target ${runId}`, description: "New Desc" });
      
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(`Updated Target ${runId}`);
      expect(res.body.data.slug).toBe(`updated-target-${runId}`);
      expect(res.body.data.description).toBe("New Desc");
    });

    it("UPDATE-02: permissionIds diye existing permissions replace (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ permissionIds: [permMap["role.create"], permMap["role.edit"]] });
      
      expect(res.status).toBe(200);
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: targetRoleId }, include: { permissions: true } });
      expect(dbRole.permissions.length).toBe(2);
      expect(dbRole.permissions.some(p => p.permissionId === permMap["role.create"])).toBe(true);
      expect(dbRole.permissions.some(p => p.permissionId === permMap["role.view"])).toBe(false); // Old one removed
    });

    it("UPDATE-03: permissionIds field omit kore update, existing mappings unchanged (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ description: "Desc only" }); // Omitted permissionIds
      
      expect(res.status).toBe(200);
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: targetRoleId }, include: { permissions: true } });
      expect(dbRole.permissions.length).toBe(2); // Still 2 from previous test
    });

    it("UPDATE-04: permissionIds: [] diye update, sob permission mapping clear (200)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ permissionIds: [] });
      
      expect(res.status).toBe(200);
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: targetRoleId }, include: { permissions: true } });
      expect(dbRole.permissions.length).toBe(0);
    });

    it("UPDATE-05: Onno role-er duplicate name/slug (409)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`)
        .send({ name: `Full Role ${runId}` });
      
      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already exists");
    });

    it("UPDATE-06: Valid-format-er nonexistent role ID (404)", async () => {
      const res = await request(app).patch(`/api/v1/admin/roles/${deletedRoleCuid}`).set("Authorization", `Bearer ${fullAdminToken}`).send({ name: "Ghost" });
      expect(res.status).toBe(404);
    });

    it("UPDATE-07: Invalid role ID ba invalid body (400)", async () => {
      const res1 = await request(app).patch("/api/v1/admin/roles/bad_id").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: "Test" });
      const res2 = await request(app).patch(`/api/v1/admin/roles/${targetRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`).send({ permissionIds: ["bad-cuid"] });
      
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });
  });

  // Delete Functional Role
  describe("G. Delete Functional Role (DELETE /api/v1/admin/roles/:id)", () => {
    let unassignedRoleId;
    
    beforeAll(async () => {
      const res = await request(app).post("/api/v1/admin/roles").set("Authorization", `Bearer ${fullAdminToken}`).send({ name: `ToDelete ${runId}` });
      unassignedRoleId = res.body.data.id;
    });

    it("DELETE-01: User assignment nei emon role delete (200)", async () => {
      const res = await request(app).delete(`/api/v1/admin/roles/${unassignedRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(200);
      
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: unassignedRoleId } });
      expect(dbRole).toBeNull();
    });

    it("DELETE-02: User-er sathe assigned role delete (409)", async () => {
      const res = await request(app).delete(`/api/v1/admin/roles/${assignedRoleId}`).set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(409);
      expect(res.body.message).toContain("user(s) currently assigned");

      // Verify it's still in the DB
      const dbRole = await prisma.functionalRole.findUnique({ where: { id: assignedRoleId } });
      expect(dbRole).not.toBeNull();
    });

    it("DELETE-03: Valid-format-er nonexistent role ID (404)", async () => {
      const res = await request(app).delete(`/api/v1/admin/roles/${deletedRoleCuid}`).set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(404);
    });

    it("DELETE-04: Invalid ID format (400)", async () => {
      const res = await request(app).delete("/api/v1/admin/roles/bad_id").set("Authorization", `Bearer ${fullAdminToken}`);
      expect(res.status).toBe(400);
    });
  });
});