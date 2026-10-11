import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { generateRequestFingerprint } from "../../../src/shared/utils/fingerprint.js";

describe("generateRequestFingerprint()", () => {
  it("should take IP from x-forwarded-for and ignore socket IP, returning a 64-character hex string", () => {
    const req = {
      headers: {
        "x-forwarded-for": "192.168.1.10",
        "user-agent": "Mozilla/5.0",
      },
      socket: {
        remoteAddress: "10.0.0.1",
      },
    };
    const result = generateRequestFingerprint(req);

    expect(typeof result).toBe("string");
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[a-f0-9]{64}$/);

    const expectedHash = crypto
      .createHash("sha256")
      .update("192.168.1.10-Mozilla/5.0")
      .digest("hex");
    expect(result).toBe(expectedHash);
  });

  it("should take the first IP if multiple forwarded IPs are present", () => {
    const req = {
      headers: {
        "x-forwarded-for": "192.168.1.10, 10.0.0.1, 172.16.0.1",
        "user-agent": "Mozilla/5.0",
      },
      socket: {},
    };
    const result = generateRequestFingerprint(req);
    const expectedHash = crypto
      .createHash("sha256")
      .update("192.168.1.10-Mozilla/5.0")
      .digest("hex");
    expect(result).toBe(expectedHash);
  });

  it("should use socket IP if x-forwarded-for is missing", () => {
    const req = {
      headers: {},
      socket: {
        remoteAddress: "10.20.30.40",
      },
    };
    const result = generateRequestFingerprint(req);
    const expectedHash = crypto
      .createHash("sha256")
      .update("10.20.30.40-unknown-agent")
      .digest("hex");
    expect(result).toBe(expectedHash);
  });

  it("should fall back to defaults (127.0.0.1 and unknown-agent) if IP and UA are missing", () => {
    const req = {
      headers: {},
      socket: {},
    };
    const result = generateRequestFingerprint(req);
    const expectedHash = crypto
      .createHash("sha256")
      .update("127.0.0.1-unknown-agent")
      .digest("hex");
    expect(result).toBe(expectedHash);
  });

  it("should generate different fingerprints for the same IP but different User-Agents", () => {
    const req1 = {
      headers: { "user-agent": "Chrome" },
      socket: { remoteAddress: "192.168.1.10" },
    };
    const req2 = {
      headers: { "user-agent": "Firefox" },
      socket: { remoteAddress: "192.168.1.10" },
    };
    const result1 = generateRequestFingerprint(req1);
    const result2 = generateRequestFingerprint(req2);

    expect(result1).not.toBe(result2);
  });

  it("should return a deterministic output for the exact same request", () => {
    // Same request → deterministic fingerprint
    const req = {
      headers: {
        "x-forwarded-for": "172.16.0.5",
        "user-agent": "Safari/605.1.15",
      },
      socket: {},
    };
    const first = generateRequestFingerprint(req);
    const second = generateRequestFingerprint(req);

    expect(first).toBe(second);
  });
});