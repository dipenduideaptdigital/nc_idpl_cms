import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

vi.mock("../../../src/shared/services/email.service.js", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));
vi.mock("../../../src/shared/services/recaptcha.service.js", () => ({
  verifyRecaptchaToken: vi.fn().mockResolvedValue(true),
}));

import { sendEmail } from "../../../src/shared/services/email.service.js";

describe("Authentication API Integration Tests", () => {
  let userRole, adminRole, superAdminRole;
  
  // Base test user payload
  const validPassword = "StrongPassword123!";
  const baseUser = {
    name: "Integration User",
    email: "integration_auth@example.com",
    password: validPassword,
    recaptchaToken: "mock-sandbox-pass-token-signature"
  };

  let ipCounter = 1;
  const getIp = () => `192.168.100.${ipCounter++}`;

  beforeAll(async () => {
    // Teardown existing test data
    await prisma.adminInvitation.deleteMany({ where: { email: { contains: "@example.com" } } });
    await prisma.user.deleteMany({ where: { email: { contains: "@example.com" } } });

    // Ensure System Roles exist
    userRole = await prisma.systemRole.upsert({ where: { slug: "USER" }, update: {}, create: { name: "User", slug: "USER" } });
    adminRole = await prisma.systemRole.upsert({ where: { slug: "ADMIN" }, update: {}, create: { name: "Admin", slug: "ADMIN" } });
    superAdminRole = await prisma.systemRole.upsert({ where: { slug: "SUPER_ADMIN" }, update: {}, create: { name: "Super Admin", slug: "SUPER_ADMIN" } });
  });

  afterAll(async () => {
    await prisma.adminInvitation.deleteMany({ where: { email: { contains: "@example.com" } } });
    await prisma.user.deleteMany({ where: { email: { contains: "@example.com" } } });
    await prisma.$disconnect();
  });

  // User Registration
  describe("A. POST /api/v1/auth/register", () => {
    const ip = getIp(1);

    it("REG-01: Valid data diye registration (201)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send(baseUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      
      const dbUser = await prisma.user.findUnique({ where: { email: baseUser.email }, include: { systemRole: true } });
      expect(dbUser).not.toBeNull();
      expect(dbUser.systemRole.slug).toBe("USER");
    });

    it("REG-02: Response-e password ba password hash leak kora jabe na", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send({ ...baseUser, email: "leak_test@example.com" });

      expect(response.status).toBe(201);
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.data).not.toHaveProperty("passwordHash");
    });

    it("REG-03: Uppercase/space thaka email trim ebong lowercase hobe", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send({ ...baseUser, email: "  UPPERCASE@Example.COM  " });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("uppercase@example.com");
    });

    it("REG-04: Already registered email diye abar registration (400)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send(baseUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email already exists");
    });

    it("REG-05: Invalid email ba missing field (400 Expected, catches Issue #1)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
    });

    it("REG-06: Weak password diye registration (400)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .set("X-Forwarded-For", ip)
        .send({ ...baseUser, email: "weak@example.com", password: "123" });

      expect(response.status).toBe(400);
      const dbUser = await prisma.user.findUnique({ where: { email: "weak@example.com" } });
      expect(dbUser).toBeNull(); // Ensure it didn't save
    });
  });

  // User Login
  describe("B. POST /api/v1/auth/login", () => {
    const ip = getIp(2);
    let authCookie = "";

    it("LOG-01 & LOG-02: Valid credentials returns 200, access token, and HttpOnly refresh cookie", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .set("X-Forwarded-For", getIp())
        .send({ email: baseUser.email, password: validPassword, recaptchaToken: baseUser.recaptchaToken });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.includes("refreshToken=") && c.includes("HttpOnly"))).toBe(true);
      
      authCookie = cookies.find(c => c.startsWith("refreshToken="));
    });

    it("LOG-03: Login-er por database-e refresh token hash ebong lastLoginAt update hobe", async () => {
      const dbUser = await prisma.user.findUnique({ where: { email: baseUser.email }, include: { refreshTokens: true } });
      expect(dbUser.lastLoginAt).not.toBeNull();
      expect(dbUser.refreshTokens.length).toBeGreaterThan(0);
      expect(dbUser.refreshTokens[0].revokedAt).toBeNull();
    });

    it("LOG-04 & LOG-05: Unknown email or wrong password returns 401 Invalid credentials", async () => {
      const res1 = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: "unknown@example.com", password: validPassword });
      const res2 = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: baseUser.email, password: "WrongPassword!" });

      expect(res1.status).toBe(401);
      expect(res1.body.message).toBe("Invalid credentials");
      expect(res2.status).toBe(401);
      expect(res2.body.message).toBe("Invalid credentials");
    });

    it("LOG-06: PENDING, SUSPENDED, INACTIVE account returns 403", async () => {
      await prisma.user.update({ where: { email: baseUser.email }, data: { status: "SUSPENDED" } });
      
      const response = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: baseUser.email, password: validPassword });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Account suspended");

      // Restore
      await prisma.user.update({ where: { email: baseUser.email }, data: { status: "ACTIVE" } });
    });

    it("LOG-07: Regular user trying to login via admin portal returns 403", async () => {
      const response = await request(app)
        .post("/api/v1/auth/admin-login")
        .set("X-Forwarded-For", ip)
        .send({ email: baseUser.email, password: validPassword });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain("Access denied. Invalid role");
    });

    it("LOG-09: Invalid email/password payload validation (400)", async () => {
      const response = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: "bad" });
      expect(response.status).toBe(400);
    });
  });

  // Admin Login
  describe("C. POST /api/v1/auth/admin-login", () => {
    const ip = getIp();
    const adminUser = { email: "admin@example.com", password: validPassword, recaptchaToken: "mock-sandbox-pass-token-signature" };

    beforeAll(async () => {
      await prisma.user.create({
        data: { name: "Admin", email: adminUser.email, password: await bcrypt.hash(validPassword, 10), status: "ACTIVE", systemRoleId: adminRole.id }
      });
    });

    it("ADM-01: ADMIN credentials (200)", async () => {
      const response = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", ip).send(adminUser);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    it("ADM-03: Wrong admin password (401)", async () => {
      const response = await request(app).post("/api/v1/auth/admin-login").set("X-Forwarded-For", ip).send({ ...adminUser, password: "Bad!" });
      expect(response.status).toBe(401);
    });

    it("LOG-08: Admin trying to login via regular portal returns 403", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login") // standard login
        .set("X-Forwarded-For", ip)
        .send(adminUser);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain("Admins must use the dedicated Admin Portal");
    });
  });

  // Current User (/me)
  describe("D. GET /api/v1/auth/me", () => {
    const ip = getIp(4);
    let accessToken = "";

    beforeAll(async () => {
      const res = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", getIp()).send({ email: baseUser.email, password: validPassword, recaptchaToken: baseUser.recaptchaToken });
      accessToken = res.body.data.accessToken;
    });

    it("ME-01: Authorization header nei (401)", async () => {
      const response = await request(app).get("/api/v1/auth/me");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Access token missing");
    });

    it("ME-02: Malformed/expired access token (401)", async () => {
      const response = await request(app).get("/api/v1/auth/me").set("Authorization", "Bearer invalid.token.here");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid or expired token");
    });

    it("ME-03 & ME-04: Valid access token returns user data without password", async () => {
      const response = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(baseUser.email);
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("ME-05: Token user inactive hoye geche (403)", async () => {
      await prisma.user.update({ where: { email: baseUser.email }, data: { status: "INACTIVE" } });
      const response = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(403);
      await prisma.user.update({ where: { email: baseUser.email }, data: { status: "ACTIVE" } }); // Restore
    });

    it("ME-06: Token user database theke delete hoye geche (401)", async () => {
      // Create temp user and token
      await request(app).post("/api/v1/auth/register").set("X-Forwarded-For", ip).send({ name: "Temp", email: "temp@example.com", password: validPassword });
      const loginRes = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: "temp@example.com", password: validPassword });
      const tempToken = loginRes.body.data.accessToken;

      await prisma.user.delete({ where: { email: "temp@example.com" } }); // Hard delete

      const response = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${tempToken}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("User no longer exists");
    });
  });

  // Refresh Token
  describe("E. POST /api/v1/auth/refresh-token", () => {
    const ip = getIp(5);
    let validCookie = "";

    beforeAll(async () => {
      const res = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", getIp()).send({ email: baseUser.email, password: validPassword, recaptchaToken: baseUser.recaptchaToken });
      validCookie = res.headers["set-cookie"].find(c => c.startsWith("refreshToken="));
    });

    it("REF-01: Cookie nei (401)", async () => {
      const response = await request(app).post("/api/v1/auth/refresh-token").set("X-Forwarded-For", ip);
      expect(response.status).toBe(401);
    });

    it("REF-02: Invalid/tampered cookie (401)", async () => {
      const response = await request(app).post("/api/v1/auth/refresh-token").set("X-Forwarded-For", ip).set("Cookie", ["refreshToken=fake.jwt.token"]);
      expect(response.status).toBe(401);
    });

    it("REF-03: Valid cookie returns new access token (200)", async () => {
      const response = await request(app).post("/api/v1/auth/refresh-token").set("X-Forwarded-For", ip).set("Cookie", [validCookie]);
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    it("REF-05: Valid JWT but token missing in DB (Reuse Detection)", async () => {
      // Clear all tokens from DB to simulate reuse
      await prisma.refreshToken.deleteMany({ where: { user: { email: baseUser.email } } });

      const response = await request(app).post("/api/v1/auth/refresh-token").set("X-Forwarded-For", ip).set("Cookie", [validCookie]);
      expect(response.status).toBe(401);
      expect(response.body.message).toContain("reuse detected");
    });
  });

  // Logout
  describe("F & G. POST /api/v1/auth/logout & /logout-all", () => {
    const ip = getIp(6);

    it("OUT-01: Cookie chara logout (200)", async () => {
      const response = await request(app).post("/api/v1/auth/logout").set("X-Forwarded-For", ip);
      expect(response.status).toBe(200);
    });

    it("OUT-02: Valid cookie diye logout revokes DB token", async () => {
      const loginRes = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: baseUser.email, password: validPassword });
      const cookie = loginRes.headers["set-cookie"].find(c => c.startsWith("refreshToken="));

      const response = await request(app).post("/api/v1/auth/logout").set("X-Forwarded-For", ip).set("Cookie", [cookie]);
      expect(response.status).toBe(200);

      // Verify clearance header
      expect(response.headers["set-cookie"].some(c => c.includes("refreshToken=;"))).toBe(true);
    });

    it("OUTALL-02 & OUTALL-04: Logout all devices", async () => {
      await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: baseUser.email, password: validPassword });
      const loginRes2 = await request(app).post("/api/v1/auth/login").set("X-Forwarded-For", ip).send({ email: baseUser.email, password: validPassword });
      
      const response = await request(app)
        .post("/api/v1/auth/logout-all")
        .set("X-Forwarded-For", ip)
        .set("Authorization", `Bearer ${loginRes2.body.data.accessToken}`); // Requires auth

      expect(response.status).toBe(200);
      
      const activeTokens = await prisma.refreshToken.count({ where: { user: { email: baseUser.email }, revokedAt: null } });
      expect(activeTokens).toBe(0);
    });
  });

  //  Forgot / Reset Password
  describe("H & I. Forgot / Reset Password Flow", () => {
    const ip = getIp(7);
    let resetTokenRaw = "";

    it("FP-01, FP-02, FP-04: Forgot password logic returns generic success", async () => {
      const response = await request(app).post("/api/v1/auth/forgot-password").set("X-Forwarded-For", ip).send({ email: baseUser.email });
      expect(response.status).toBe(200);
      expect(sendEmail).toHaveBeenCalledTimes(1);

      // Extract raw token from mocked email service arguments for the next test
      const emailHtml = sendEmail.mock.calls[0][0].html;
      resetTokenRaw = emailHtml.match(/token=([a-f0-9]+)/)[1];
    });

    it("FP-03: Database saves hashed token, not raw token", async () => {
      const hashed = crypto.createHash("sha256").update(resetTokenRaw).digest("hex");
      const dbRecord = await prisma.passwordResetToken.findFirst({ where: { tokenHash: hashed } });
      expect(dbRecord).not.toBeNull();
    });

    it("RP-01 & RP-08: Reset password with weak password or invalid token (400)", async () => {
      const res1 = await request(app).post("/api/v1/auth/reset-password").set("X-Forwarded-For", ip).send({ token: "bad-token", password: "StrongPassword123!" });
      const res2 = await request(app).post("/api/v1/auth/reset-password").set("X-Forwarded-For", ip).send({ token: resetTokenRaw, password: "weak" });
      
      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });

    it("RP-03 & RP-06: Successful reset updates password and marks token used", async () => {
      const newPassword = "NewStrongPassword123!";
      const response = await request(app).post("/api/v1/auth/reset-password").set("X-Forwarded-For", ip).send({ token: resetTokenRaw, password: newPassword });
      
      expect(response.status).toBe(200);

      const dbUser = await prisma.user.findUnique({ where: { email: baseUser.email } });
      const isMatch = await bcrypt.compare(newPassword, dbUser.password);
      expect(isMatch).toBe(true);

      const dbToken = await prisma.passwordResetToken.findFirst({ where: { user: { email: baseUser.email } } });
      expect(dbToken.usedAt).not.toBeNull();
    });
  });

  // Setup Admin Account
  describe("K. POST /api/v1/auth/setup-admin", () => {
    const ip = getIp(8);
    const inviteEmail = "invited@example.com";
    let inviteTokenRaw = "mock_raw_invite_token";

    beforeAll(async () => {
      const tokenHash = crypto.createHash("sha256").update(inviteTokenRaw).digest("hex");
      const inviter = await prisma.user.findUnique({ where: { email: baseUser.email } });
      
      await prisma.user.create({ data: { name: "Invited Admin", email: inviteEmail, password: "temp", status: "PENDING", systemRoleId: adminRole.id } });
      await prisma.adminInvitation.create({ data: { email: inviteEmail, tokenHash, systemRoleId: adminRole.id, invitedById: inviter.id, expiresAt: new Date(Date.now() + 86400000) } });
    });

    it("SA-07: Should reject weak password during setup (400) - Catches Issue #3", async () => {
      const response = await request(app)
        .post("/api/v1/auth/setup-admin")
        .set("X-Forwarded-For", ip)
        .send({ token: inviteTokenRaw, password: "weak" });

      expect(response.status).toBe(400); 
    });

    it("SA-04, SA-05, SA-06: Valid setup hashes password, sets ACTIVE, deletes invitation", async () => {
      const newPassword = "AdminSecurePass123!";
      const response = await request(app)
        .post("/api/v1/auth/setup-admin")
        .set("X-Forwarded-For", ip)
        .send({ token: inviteTokenRaw, password: newPassword });

      expect(response.status).toBe(200);

      const dbUser = await prisma.user.findUnique({ where: { email: inviteEmail } });
      expect(dbUser.status).toBe("ACTIVE");
      const isMatch = await bcrypt.compare(newPassword, dbUser.password);
      expect(isMatch).toBe(true);

      const dbInvite = await prisma.adminInvitation.findFirst({ where: { email: inviteEmail } });
      expect(dbInvite).toBeNull();
    });
  });
});