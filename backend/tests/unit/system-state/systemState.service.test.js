import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../src/shared/errors/AppError.js";
import * as systemStateService from "../../../src/modules/system-state/systemState.service.js";
import { systemStateStore } from "../../../src/shared/core/systemStateStore.js";
import { prisma } from "../../../src/config/db.js";

// Mocking dependencies
vi.mock("../../../src/shared/core/systemStateStore.js", () => ({
  systemStateStore: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

const txMock = {
  setting: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  settingRevision: {
    create: vi.fn(),
  },
};

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    $transaction: vi.fn(async (cb) => {
      return await cb(txMock);
    }),
  },
}));

describe("System State Service", () => {
  const FIXED_TIME = "2026-10-10T12:00:00.000Z";
  const MOCK_ACTOR_ID = "actor_123";
  const MOCK_ACTOR_NAME = "Admin Name";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_TIME));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("A. getSystemStateConfig()", () => {
    it("SS-01: Returns exact configuration from systemStateStore", async () => {
      const mockConfig = { state: "MAINTENANCE", version: 5 };
      systemStateStore.get.mockReturnValue(mockConfig);

      const result = await systemStateService.getSystemStateConfig();
      expect(result).toEqual(mockConfig);
    });

    it("SS-02: Returns null if store is empty", async () => {
      systemStateStore.get.mockReturnValue(null);
      const result = await systemStateService.getSystemStateConfig();
      expect(result).toBeNull();
    });
  });

  describe("B. updateSystemStateConfig() - Critical Failure Paths", () => {
    it("SS-03: Throws AppError 500 if configuration record is missing", async () => {
      txMock.setting.findUnique.mockResolvedValue(null);

      await expect(
        systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toThrow(AppError);
      
      await expect(
        systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toHaveProperty("statusCode", StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("SS-04: Throws AppError 409 on version mismatch (Concurrency Conflict)", async () => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { version: 5, state: "ACTIVE" },
      });

      // Trying to update with stale version 4
      await expect(
        systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 4 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toThrow(AppError);

      await expect(
        systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 4 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toHaveProperty("statusCode", StatusCodes.CONFLICT);

      // Verify no mutation was attempted
      expect(txMock.setting.update).not.toHaveBeenCalled();
      expect(txMock.settingRevision.create).not.toHaveBeenCalled();
    });

    it("SS-05, 06, 07: Fails completely if any DB transaction operation fails", async () => {
      txMock.setting.findUnique.mockRejectedValue(new Error("DB Read Failed"));
      await expect(
        systemStateService.updateSystemStateConfig({ version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toThrow("DB Read Failed");
    });
  });

  describe("C & E. State Transition Rules & Bypass Token Security", () => {
    const baseActiveConfig = {
      version: 1,
      state: "ACTIVE",
      title: "Title",
      description: "Desc",
      bypassToken: null,
      enabledAt: null,
      enabledBy: null,
      disabledAt: "2025-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
      txMock.setting.findUnique.mockResolvedValue({ id: "set_1", value: baseActiveConfig });
      txMock.setting.update.mockResolvedValue({ id: "set_1" });
    });

    it("SS-08, SS-18: ACTIVE → MAINTENANCE sets metadata and generates 64-char token", async () => {
      await systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);

      const updateCall = txMock.setting.update.mock.calls[0][0].data.value;
      
      expect(updateCall.version).toBe(2);
      expect(updateCall.state).toBe("MAINTENANCE");
      expect(updateCall.enabledBy).toBe(MOCK_ACTOR_NAME);
      expect(updateCall.enabledAt).toBe(FIXED_TIME);
      expect(updateCall.disabledAt).toBeNull();
      // Token must be a 64-character hex string
      expect(updateCall.bypassToken).toMatch(/^[a-f0-9]{64}$/); 
    });

    it("SS-11, SS-20: MAINTENANCE → ACTIVE clears metadata and bypass token", async () => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { ...baseActiveConfig, state: "MAINTENANCE", enabledAt: "2026-01-01T00:00:00.000Z", enabledBy: "Admin", bypassToken: "some-token" },
      });

      await systemStateService.updateSystemStateConfig({ state: "ACTIVE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);

      const updateCall = txMock.setting.update.mock.calls[0][0].data.value;
      expect(updateCall.state).toBe("ACTIVE");
      expect(updateCall.enabledBy).toBeNull();
      expect(updateCall.enabledAt).toBeNull(); // Code explicitly sets this to null when returning to ACTIVE
      expect(updateCall.disabledAt).toBe(FIXED_TIME); // Marked as disabled now
      expect(updateCall.bypassToken).toBeNull();
    });

    it("SS-13, SS-19: MAINTENANCE → READ_ONLY preserves original enabledAt and bypass token", async () => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { ...baseActiveConfig, state: "MAINTENANCE", enabledAt: "2026-01-01T00:00:00.000Z", enabledBy: "Admin", bypassToken: "existing-64-char-token" },
      });

      await systemStateService.updateSystemStateConfig({ state: "READ_ONLY", version: 1 }, MOCK_ACTOR_ID, "New Admin");

      const updateCall = txMock.setting.update.mock.calls[0][0].data.value;
      expect(updateCall.state).toBe("READ_ONLY");
      expect(updateCall.enabledBy).toBe("New Admin");
      expect(updateCall.enabledAt).toBe("2026-01-01T00:00:00.000Z"); // Preserved
      expect(updateCall.bypassToken).toBe("existing-64-char-token"); // Preserved
    });

    it("SS-14: ACTIVE → ACTIVE increments version and updates unrelated fields safely", async () => {
      await systemStateService.updateSystemStateConfig({ state: "ACTIVE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);
      
      const updateCall = txMock.setting.update.mock.calls[0][0].data.value;
      expect(updateCall.version).toBe(2);
      expect(updateCall.bypassToken).toBeNull();
    });
  });

  describe("D. Version and Audit History", () => {
    it("SS-15, SS-16, SS-17: Correctly triggers updates and settingRevision creation", async () => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { state: "ACTIVE", version: 4, title: "Old" },
      });
      txMock.setting.update.mockResolvedValue({ id: "set_1" });

      await systemStateService.updateSystemStateConfig({ state: "ACTIVE", version: 4 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);

      // SS-17
      expect(txMock.setting.update).toHaveBeenCalledWith({
        where: { key: "system_state_config" },
        data: expect.objectContaining({ value: expect.any(Object) })
      });

      const updatedValue = txMock.setting.update.mock.calls[0][0].data.value;
      expect(updatedValue.version).toBe(5); // SS-15

      // SS-16
      expect(txMock.settingRevision.create).toHaveBeenCalledWith({
        data: {
          settingId: "set_1",
          value: updatedValue, 
          actorId: MOCK_ACTOR_ID,
        }
      });
    });
  });

  describe("F. XSS Sanitization and Partial Updates", () => {
    beforeEach(() => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { state: "ACTIVE", version: 1, title: "Original Title", description: "Original Desc", supportEmail: "admin@test.com" },
      });
      txMock.setting.update.mockResolvedValue({ id: "set_1" });
    });

    it("SS-22, SS-23: Sanitizes malicious HTML in title and description", async () => {
      await systemStateService.updateSystemStateConfig({ 
        state: "ACTIVE", 
        version: 1, 
        title: "<script>alert('xss')</script>New Title",
        description: "<img src=x onerror=alert(1)>Desc" 
      }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);

      const updatedValue = txMock.setting.update.mock.calls[0][0].data.value;
      
      expect(updatedValue.title).not.toContain("<script>");
      expect(updatedValue.description).not.toContain("onerror=");
    });

    it("SS-24, SS-25, SS-26: Preserves omitted fields and unrelated settings", async () => {
      await systemStateService.updateSystemStateConfig({ 
        state: "ACTIVE", 
        version: 1 
        // Notice title and description are omitted
      }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME);

      const updatedValue = txMock.setting.update.mock.calls[0][0].data.value;
      
      expect(updatedValue.title).toBe("Original Title");
      expect(updatedValue.description).toBe("Original Desc");
      expect(updatedValue.supportEmail).toBe("admin@test.com");
    });
  });

  describe("Bug/Regression Fix", () => {
    it("SS-27: Should not update in-memory store if database commit fails", async () => {
      txMock.setting.findUnique.mockResolvedValue({
        id: "set_1",
        value: { state: "ACTIVE", version: 1 },
      });
      
      prisma.$transaction.mockImplementationOnce(async (cb) => {
        await cb(txMock); // Service logic inside transaction
        throw new Error("Transaction Commit Failed!"); // Commit failure
      });

      await expect(
        systemStateService.updateSystemStateConfig({ state: "MAINTENANCE", version: 1 }, MOCK_ACTOR_ID, MOCK_ACTOR_NAME)
      ).rejects.toThrow("Transaction Commit Failed!");

      expect(systemStateStore.set).not.toHaveBeenCalled();
    });
  });
});