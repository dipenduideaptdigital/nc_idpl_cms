import { describe, it, expect, vi, beforeEach } from "vitest";
import { systemStateStore } from "../../../src/shared/core/systemStateStore.js";
import { prisma } from "../../../src/config/db.js";
import { logger } from "../../../src/config/logger.js";

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../../../src/config/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("System State Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the singleton state before each test to prevent leakage
    systemStateStore.state = null;
  });

  const defaultExpectedState = {
    state: "ACTIVE",
    title: "We'll be back soon!",
    description: "Our system is currently undergoing scheduled maintenance to improve your experience.",
    estimatedCompletion: null,
    supportEmail: "support@subhaakritee.com",
    supportPhone: "+91 9831-637-409",
    showSocialLinks: true,
    allowSearchEngine: true,
    enabledBy: null,
    enabledAt: null,
    reason: "Initial deployment",
    version: 1,
    bypassToken: null,
  };

  describe("initialize()", () => {
    it("STORE-01: should load the stored value into state if setting exists completely", async () => {
      const mockDbConfig = { state: "MAINTENANCE", version: 2, bypassToken: "secret123" };
      prisma.setting.findUnique.mockResolvedValue({ value: mockDbConfig });

      await systemStateStore.initialize();

      expect(prisma.setting.findUnique).toHaveBeenCalledWith({ where: { key: "system_state_config" } });
      expect(systemStateStore.get()).toEqual({ ...defaultExpectedState, ...mockDbConfig });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("initialized successfully in 'MAINTENANCE' mode."));
    });

    it("STORE-02: should merge missing fields from defaultState if setting exists with partial value", async () => {
      const partialConfig = { state: "READ_ONLY" }; // Missing version, bypassToken, etc.
      prisma.setting.findUnique.mockResolvedValue({ value: partialConfig });

      await systemStateStore.initialize();

      const currentState = systemStateStore.get();
      expect(currentState.state).toBe("READ_ONLY");
      expect(currentState.title).toBe(defaultExpectedState.title); // Fallback to default
      expect(currentState.version).toBe(1);
    });

    it("STORE-03: should initialize default state and create DB record if setting does not exist", async () => {
      prisma.setting.findUnique.mockResolvedValue(null);
      prisma.setting.create.mockResolvedValue({});

      await systemStateStore.initialize();

      expect(prisma.setting.create).toHaveBeenCalledWith({
        data: { key: "system_state_config", value: defaultExpectedState },
      });
      expect(systemStateStore.get()).toEqual(defaultExpectedState);
    });

    it("STORE-04: should initialize default state and create DB record if record exists but value is null", async () => {
      prisma.setting.findUnique.mockResolvedValue({ value: null });
      prisma.setting.create.mockResolvedValue({});

      await systemStateStore.initialize();

      expect(prisma.setting.create).toHaveBeenCalled();
      expect(systemStateStore.get()).toEqual(defaultExpectedState);
    });

    it("STORE-05: should fallback to default state and log CRITICAL error if findUnique fails", async () => {
      const dbError = new Error("Database connection timeout");
      prisma.setting.findUnique.mockRejectedValue(dbError);

      await systemStateStore.initialize();

      expect(logger.error).toHaveBeenCalledWith("CRITICAL: Failed to initialize System State Engine.", dbError);
      expect(systemStateStore.get()).toEqual(defaultExpectedState);
      expect(prisma.setting.create).not.toHaveBeenCalled();
    });

    it("STORE-06: should fallback to default state and log CRITICAL error if create fails", async () => {
      prisma.setting.findUnique.mockResolvedValue(null);
      const dbError = new Error("Write permission denied");
      prisma.setting.create.mockRejectedValue(dbError);

      await systemStateStore.initialize();

      expect(logger.error).toHaveBeenCalledWith("CRITICAL: Failed to initialize System State Engine.", dbError);
      expect(systemStateStore.get()).toEqual(defaultExpectedState);
    });
  });

  describe("get() and set()", () => {
    it("STORE-07: get() should return the current state safely", () => {
      systemStateStore.state = { test: "data" };
      expect(systemStateStore.get()).toEqual({ test: "data" });
    });

    it("STORE-08: set() should preserve existing fields and merge new state", () => {
      systemStateStore.state = { fieldA: "A", fieldB: "B" };
      systemStateStore.set({ fieldB: "Updated B", fieldC: "C" });
      
      expect(systemStateStore.get()).toEqual({
        fieldA: "A",
        fieldB: "Updated B",
        fieldC: "C",
      });
    });
  });
});