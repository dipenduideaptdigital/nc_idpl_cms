import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

vi.mock("../../../src/shared/services/cloudinary.service.js", () => ({
  uploadBufferToCloudinary: vi.fn(),
  deleteFromCloudinary: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../../src/shared/utils/imageProcessor.js", () => ({
  processImageBuffer: vi.fn(),
}));

import { uploadBufferToCloudinary } from "../../../src/shared/services/cloudinary.service.js";
import { processImageBuffer } from "../../../src/shared/utils/imageProcessor.js";

describe("Uploads API Integration Tests", () => {
  const runId = Date.now().toString();
  const rawPassword = "SecurePassword123!";
  
  let sysRoleAdmin, sysRoleSuperAdmin;
  let permMap = {};
  
  // Actors
  const actors = {
    super: { id: "", email: `super_up_${runId}@test.com`, token: "" },
    view: { id: "", email: `view_up_${runId}@test.com`, token: "" },
    upload: { id: "", email: `upload_up_${runId}@test.com`, token: "" },
    delete: { id: "", email: `delete_up_${runId}@test.com`, token: "" },
    none: { id: "", email: `none_up_${runId}@test.com`, token: "" }
  };

  // Trackers for cleanup
  let uploadedMediaIds = [];
  let testProjectIds = [];

  // Reusable fake file buffer
  const fakeImageBuffer = Buffer.alloc(1024, "a");

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    sysRoleAdmin = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    sysRoleSuperAdmin = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });

    const perms = ["media.view", "media.upload", "media.delete"];
    for (const p of perms) {
      const dbP = await prisma.permission.upsert({ where: { slug: p }, update: {}, create: { name: p, slug: p, module: "MEDIA" } });
      permMap[p] = dbP.id;
    }

    const createFr = async (slugPrefix, pIds) => {
      return await prisma.functionalRole.create({
        data: { name: `FR_${slugPrefix}_${runId}`, slug: `${slugPrefix}-${runId}`, permissions: { create: pIds.map(id => ({ permissionId: id })) } }
      });
    };

    const frView = await createFr("up_view", [permMap["media.view"]]);
    const frUpload = await createFr("up_upload", [permMap["media.upload"]]);
    const frDelete = await createFr("up_delete", [permMap["media.delete"]]);

    const setupActor = async (key, sysRoleId, funcRoleId = null) => {
      const u = await prisma.user.create({
        data: {
          name: `Actor ${key}`, email: actors[key].email, password: passwordHash, status: "ACTIVE", systemRoleId: sysRoleId,
          functionalRoles: funcRoleId ? { create: [{ functionalRoleId: funcRoleId }] } : undefined
        }
      });
      actors[key].id = u.id;
    };

    await setupActor("super", sysRoleSuperAdmin.id);
    await setupActor("view", sysRoleAdmin.id, frView.id);
    await setupActor("upload", sysRoleAdmin.id, frUpload.id);
    await setupActor("delete", sysRoleAdmin.id, frDelete.id);
    await setupActor("none", sysRoleAdmin.id);

    let loginIpCounter = 1;
    const getToken = async (email) => {
      const res = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", `192.168.210.${loginIpCounter++}`).send({ email, password: rawPassword });
      return res.body.data.accessToken;
    };

    for (const key of Object.keys(actors)) {
      actors[key].token = await getToken(actors[key].email);
    }
  });

  afterAll(async () => {
    
    const testUploaderIds = Object.values(actors)
    .map((actor) => actor.id)
    .filter(Boolean);

    await prisma.project.deleteMany({
    where: { id: { in: testProjectIds } },
    });

    await prisma.media.deleteMany({
    where: {
        OR: [
        { id: { in: uploadedMediaIds } },
        { uploadedById: { in: testUploaderIds } },
        ],
    },
    });

    await prisma.refreshToken.deleteMany({
    where: { userId: { in: testUploaderIds } },
    });

    await prisma.userFunctionalRole.deleteMany({
    where: { userId: { in: testUploaderIds } },
    });

    await prisma.functionalRolePermission.deleteMany({
    where: { functionalRole: { slug: { contains: runId } } },
    });

    await prisma.user.deleteMany({
    where: { id: { in: testUploaderIds } },
    });

    await prisma.functionalRole.deleteMany({
    where: { slug: { contains: runId } },
    });

    await prisma.$disconnect();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default happy-path mocks for the processors
    processImageBuffer.mockResolvedValue({
      filename: "processed.webp",
      mainBuffer: Buffer.from("processed-data"),
      finalSize: 500,
      mimeType: "image/webp"
    });

    uploadBufferToCloudinary.mockImplementation(async (buffer, folder) => {
      if (buffer.toString() === "fail-cloud") throw new Error("Cloudinary Error");
      
        const uniqueId = crypto.randomUUID();
        const publicId = `${folder}/test_public_id_${uniqueId}`;

        return {
        secure_url: `https://res.cloudinary.com/demo/image/upload/v12345/${publicId}.webp`,
        public_id: publicId,
    };
    });
  });

  //  Authentication & RBAC
  describe("A. Authentication & RBAC", () => {
    it("AUTH-01 to AUTH-05: Token chara access (401)", async () => {
      const endpoints = [
        { method: "get", url: "/api/v1/uploads" },
        { method: "get", url: "/api/v1/uploads/123" },
        { method: "post", url: "/api/v1/uploads/image" },
        { method: "post", url: "/api/v1/uploads/images" },
        { method: "delete", url: "/api/v1/uploads/123" },
      ];

      for (const ep of endpoints) {
        const res = await request(app)[ep.method](ep.url);
        expect(res.status).toBe(401);
      }
    });

    it("AUTH-06: Non-admin system role (Tested implicitly via admin routes logic, but we test no-perm admin here)", async () => {
      const res = await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.none.token}`);
      expect(res.status).toBe(403);
    });

    it("AUTH-07, AUTH-08, AUTH-09 & AUTH-11: Permission boundaries (403)", async () => {
      expect((await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.view.token}`).attach("image", fakeImageBuffer, "test.jpg")).status).toBe(403);
      expect((await request(app).delete("/api/v1/uploads/123").set("Authorization", `Bearer ${actors.view.token}`).send()).status).toBe(403);
      expect((await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.upload.token}`).send()).status).toBe(403);
    });

    it("AUTH-10 & AUTH-12: Authorized access and SUPER_ADMIN bypass (200)", async () => {
      expect((await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.view.token}`).send()).status).toBe(200);
      expect((await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.super.token}`).send()).status).toBe(200);
    });
  });

  // Single Image Upload
  describe("B. Single Image Upload (POST /api/v1/uploads/image)", () => {
    it("UP-01: image field/file chara request (400)", async () => {
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).send({});
      expect(res.status).toBe(400);
    });

    it("UP-09: Wrong multipart field name (400 Expected, avoids 500)", async () => {
      const res = await request(app).post("/api/v1/uploads/image")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("wrong_field", fakeImageBuffer, "test.jpg");
      
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Unexpected field");
    });

    it("UP-02 & UP-03: Valid JPEG/PNG/WebP upload, DB persistence (201)", async () => {
      const files = ["test.jpg", "test.png", "test.webp"];
      for (const file of files) {
        const uniqueBuffer = Buffer.from(`data-${file}-${runId}`);
        const res = await request(app).post("/api/v1/uploads/image")
          .set("Authorization", `Bearer ${actors.upload.token}`)
          .attach("image", uniqueBuffer, file);

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id");
        uploadedMediaIds.push(res.body.data.id);
        
        const dbRecord = await prisma.media.findUnique({ where: { id: res.body.data.id } });
        expect(dbRecord).not.toBeNull();
      }
    });

    it("UP-04: Unsupported MIME type, jemon GIF/PDF (415)", async () => {
      const res = await request(app).post("/api/v1/uploads/image")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("image", fakeImageBuffer, "document.pdf");
      
      expect(res.status).toBe(415); 
    });

    it("UP-05: Same content abar upload — hash duplicate (201, duplicate DB row noy)", async () => {
      const dupBuffer = Buffer.from(`duplicate-test-${runId}`);
      
      const res1 = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", dupBuffer, "dup.jpg");
      expect(res1.status).toBe(201);
      uploadedMediaIds.push(res1.body.data.id);

      const res2 = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", dupBuffer, "dup2.jpg");
      expect(res2.status).toBe(201);
      expect(res2.body.data.id).toBe(res1.body.data.id);

      const dbCount = await prisma.media.count({ where: { fileHash: crypto.createHash("sha256").update(dupBuffer).digest("hex") } });
      expect(dbCount).toBe(1);
    });

    it("UP-06: Previously soft-deleted same-hash media re-upload (201, Restore Check)", async () => {
      const restoreBuffer = Buffer.from(`restore-test-${runId}`);
      
      // Upload
      const res1 = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", restoreBuffer, "restore.jpg");
      const mediaId = res1.body.data.id;
      uploadedMediaIds.push(mediaId);

      await prisma.media.update({ where: { id: mediaId }, data: { deletedAt: new Date() } });
      const res2 = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", restoreBuffer, "restore.jpg");
      expect(res2.status).toBe(201);
      expect(res2.body.data.id).toBe(mediaId);
      expect(res2.body.data.deletedAt).toBeNull(); 

      const dbRecord = await prisma.media.findUnique({ where: { id: mediaId } });
      expect(dbRecord.deletedAt).toBeNull();
    });

    it("UP-07: Cloudinary upload fail kore (500, DB safe)", async () => {
      processImageBuffer.mockResolvedValueOnce({ filename: "f.webp", mainBuffer: Buffer.from("fail-cloud"), finalSize: 100, mimeType: "image/webp" });
      
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from("fail-cloud"), "fail.jpg");
      
      expect(res.status).toBe(500);
      const dbRecord = await prisma.media.findFirst({ where: { originalName: "fail.jpg" } });
      expect(dbRecord).toBeNull();
    });

    it("UP-08: Image processing fail kore (500, Cloudinary/DB unaffected)", async () => {
      processImageBuffer.mockRejectedValueOnce(new Error("Sharp processing error"));
      
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from("sharp-fail"), "sharp.jpg");
      
      expect(res.status).toBe(500);
      expect(uploadBufferToCloudinary).not.toHaveBeenCalled();
    });
  });

  // Multiple Image Upload
  describe("C. Multiple Image Upload (POST /api/v1/uploads/images)", () => {
    it("MULTI-01: Kono file chara /images request (400)", async () => {
      const res = await request(app).post("/api/v1/uploads/images").set("Authorization", `Bearer ${actors.upload.token}`);
      expect(res.status).toBe(400);
    });

    it("MULTI-02: Duto valid image upload (201)", async () => {
      const res = await request(app).post("/api/v1/uploads/images")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("images", Buffer.from(`m1-${runId}`), "m1.jpg")
        .attach("images", Buffer.from(`m2-${runId}`), "m2.jpg");
      
      expect(res.status).toBe(201);
      expect(res.body.data.length).toBe(2);
      uploadedMediaIds.push(res.body.data[0].id, res.body.data[1].id);
    });

    it("MULTI-03 & MULTI-04: Partial failures / All failures logic handled safely by service", async () => {
      processImageBuffer
        .mockResolvedValueOnce({ filename: "p1", mainBuffer: Buffer.from("p1"), finalSize: 10, mimeType: "image/webp" })
        .mockRejectedValueOnce(new Error("Simulated Partial Error"));

      const res = await request(app).post("/api/v1/uploads/images")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("images", Buffer.from(`p1-${runId}`), "p1.jpg")
        .attach("images", Buffer.from(`p2-${runId}`), "p2.jpg"); 
      
      expect(res.status).toBe(201);
      expect(res.body.data.length).toBe(1); 
      uploadedMediaIds.push(res.body.data[0].id);
    });

    it("MULTI-05: Unsupported MIME type shoho batch (415, Multer rejects entire batch upfront)", async () => {
      const res = await request(app).post("/api/v1/uploads/images")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("images", Buffer.from(`ok-${runId}`), "ok.jpg")
        .attach("images", Buffer.from(`bad-${runId}`), "bad.pdf");
      
      expect(res.status).toBe(415);
      const dbRecord = await prisma.media.findFirst({ where: { originalName: "ok.jpg" } });
      expect(dbRecord).toBeNull();
    });
  });

  // Media List, Search & Pagination
  describe("D. Media List (GET /api/v1/uploads)", () => {
    beforeAll(async () => {
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from(`list-test-${runId}`), "Sunset_Banner.jpg");
      uploadedMediaIds.push(res.body.data.id);
    });

    it("LIST-01, LIST-02, LIST-07, LIST-09: Default list, pagination meta, sorting, uploader relation", async () => {
      const res = await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(20);
      
      expect(res.body.data[0]).toHaveProperty("uploadedBy");
      expect(res.body.data[0].uploadedBy).toHaveProperty("name");
      expect(res.body.data[0].uploadedBy).not.toHaveProperty("password");
    });

    it("LIST-03: Custom page/limit", async () => {
      const res = await request(app).get("/api/v1/uploads?page=1&limit=2").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.meta.limit).toBe(2);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it("LIST-04 & LIST-05: Partial search trimming", async () => {
      const res = await request(app).get("/api/v1/uploads?search=  unset_ban  ").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.some(m => m.originalName === "Sunset_Banner.jpg")).toBe(true);
    });

    it("LIST-06: Blank/whitespace search ignores filter", async () => {
      const res = await request(app).get("/api/v1/uploads?search=   ").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.meta.total).toBeGreaterThan(0);
    });

    it("LIST-08: Soft-deleted records excluded", async () => {
      const r = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from(`del-test-${runId}`), "hidden.jpg");
      const mediaId = r.body.data.id;
      uploadedMediaIds.push(mediaId);
      await request(app).delete(`/api/v1/uploads/${mediaId}`).set("Authorization", `Bearer ${actors.delete.token}`);

      const res = await request(app).get("/api/v1/uploads").set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.body.data.some(m => m.id === mediaId)).toBe(false);
    });

    it("LIST-10: Invalid pagination inputs (400 Expected via validation middleware)", async () => {
      const res1 = await request(app).get("/api/v1/uploads?page=-1").set("Authorization", `Bearer ${actors.view.token}`);
      const res2 = await request(app).get("/api/v1/uploads?limit=1000").set("Authorization", `Bearer ${actors.view.token}`);
      
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });
  });

  // Get Media by ID
  describe("E. Media Details (GET /api/v1/uploads/:id)", () => {
    let targetMediaId;
    beforeAll(async () => {
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from(`detail-${runId}`), "detail.jpg");
      targetMediaId = res.body.data.id;
      uploadedMediaIds.push(targetMediaId);
    });

    it("DETAIL-01: Existing active media ID (200)", async () => {
      const res = await request(app).get(`/api/v1/uploads/${targetMediaId}`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(targetMediaId);
    });

    it("DETAIL-02: Nonexistent ID (404)", async () => {
      const res = await request(app).get(`/api/v1/uploads/invalid_cuid_format`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(404);
    });

    it("DETAIL-03: Soft-deleted media ID (404)", async () => {
      await request(app).delete(`/api/v1/uploads/${targetMediaId}`).set("Authorization", `Bearer ${actors.delete.token}`);
      const res = await request(app).get(`/api/v1/uploads/${targetMediaId}`).set("Authorization", `Bearer ${actors.view.token}`);
      expect(res.status).toBe(404);
    });
  });

  // Delete Media
  describe("F. Delete Media (DELETE /api/v1/uploads/:id)", () => {
    let activeMediaId;
    beforeAll(async () => {
      const res = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from(`to-delete-${runId}`), "del.jpg");
      activeMediaId = res.body.data.id;
      uploadedMediaIds.push(activeMediaId);
    });

    it("DEL-01: Nonexistent media delete (404)", async () => {
      const res = await request(app).delete("/api/v1/uploads/fake_id").set("Authorization", `Bearer ${actors.delete.token}`);
      expect(res.status).toBe(404);
    });

    it("DEL-02: Existing media delete (200)", async () => {
      const res = await request(app).delete(`/api/v1/uploads/${activeMediaId}`).set("Authorization", `Bearer ${actors.delete.token}`);
      expect(res.status).toBe(200);
      
      const dbCheck = await prisma.media.findUnique({
        where: { id: activeMediaId },
        });

        expect(dbCheck).toBeNull();
    });

    it("DEL-04: Already soft-deleted media delete (404)", async () => {
      const res = await request(app).delete(`/api/v1/uploads/${activeMediaId}`).set("Authorization", `Bearer ${actors.delete.token}`);
      expect(res.status).toBe(404);
    });

    it("DEL-05: Project featured image relation becomes null when media is deleted", async () => {
      const imgRes = await request(app).post("/api/v1/uploads/image").set("Authorization", `Bearer ${actors.upload.token}`).attach("image", Buffer.from(`rel-${runId}`), "rel.jpg");
      const relMediaId = imgRes.body.data.id;
      uploadedMediaIds.push(relMediaId);

      const project = await prisma.project.create({
        data: {
            title: `Relation Test ${runId}`,
            slug: `relation-test-${runId}`,
            category: "Test",
            featuredImageId: relMediaId,
        },
    });
      testProjectIds.push(project.id);
      await prisma.media.delete({ where: { id: relMediaId } });

      const updatedProject = await prisma.project.findUnique({ where: { id: project.id } });
      expect(updatedProject.featuredImageId).toBeNull();
    });
  });

  // Multer Upload Limits
  describe("G. Multer Upload Limits", () => {
    it("LIMIT-01: >10MB file (413 Payload Too Large Expected)", async () => {
      const massiveBuffer = Buffer.alloc(11 * 1024 * 1024, "a"); // 11 MB
      const res = await request(app).post("/api/v1/uploads/image")
        .set("Authorization", `Bearer ${actors.upload.token}`)
        .attach("image", massiveBuffer, "huge.jpg");
      
      expect(res.status).toBe(413);
    });

    it("LIMIT-02: >50 files in multiple upload (400 Expected)", async () => {
      const reqPayload = request(app).post("/api/v1/uploads/images").set("Authorization", `Bearer ${actors.upload.token}`);
      
      for (let i = 0; i < 51; i++) {
        reqPayload.attach("images", Buffer.from(`tiny-${i}`), `tiny${i}.jpg`);
      }
      
      const res = await reqPayload;
      expect(res.status).toBe(400); 
    });
  });
});