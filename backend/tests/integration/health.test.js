import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/v1/health", () => {
  it("should return 200 and confirm that the API is healthy", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Server is healthy",
    });
  });

  it("should include a request ID in the response headers", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.headers["x-request-id"]).toMatch(
      /^[0-9a-f-]{36}$/i
    );
  });
});