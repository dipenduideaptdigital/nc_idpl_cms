// tests/unit/cms/cms.repository.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cmsRepo from "../../../src/modules/cms/cms.repository.js";
import { prisma } from "../../../src/config/db.js";

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    setting: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("CMS Repository", () => {
  let mockTx;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTx = {
      setting: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
      },
      settingRevision: {
        create: vi.fn(),
      },
    };

    //prisma.$transaction instantly execute the callback with mockTx
    prisma.$transaction.mockImplementation(async (callback, options) => {
      return await callback(mockTx);
    });
  });

  describe("findSettingByKey()", () => {
    it("CMS-R01: should query unique setting by providing the correct key", async () => {
      const mockSetting = { id: "set_1", key: "homepage_hero", value: { title: "Hero" } };
      prisma.setting.findUnique.mockResolvedValue(mockSetting);

      const result = await cmsRepo.findSettingByKey("homepage_hero");

      expect(prisma.setting.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.setting.findUnique).toHaveBeenCalledWith({
        where: { key: "homepage_hero" },
      });
      expect(result).toEqual(mockSetting);
    });

    it("CMS-R02: should return null if setting is not found", async () => {
      prisma.setting.findUnique.mockResolvedValue(null);
      const result = await cmsRepo.findSettingByKey("unknown_key");
      expect(result).toBeNull();
    });
  });

  describe("findSettingsByKeys()", () => {
    it("CMS-R03: should pass correct array to 'in' operator for multiple keys", async () => {
      const mockSettings = [{ key: "k1" }, { key: "k2" }];
      prisma.setting.findMany.mockResolvedValue(mockSettings);

      const keys = ["k1", "k2"];
      const result = await cmsRepo.findSettingsByKeys(keys);

      expect(prisma.setting.findMany).toHaveBeenCalledWith({
        where: { key: { in: keys } },
      });
      expect(result).toEqual(mockSettings);
    });

    it("CMS-R04: should handle empty keys array perfectly", async () => {
      prisma.setting.findMany.mockResolvedValue([]);
      
      const result = await cmsRepo.findSettingsByKeys([]);

      expect(prisma.setting.findMany).toHaveBeenCalledWith({
        where: { key: { in: [] } },
      });
      expect(result).toEqual([]);
    });
  });

  describe("upsertSetting()", () => {
    const key = "homepage_footer";
    const value = { content: "Footer Data" };

    it("CMS-R05: should NOT create settingRevision if setting does not exist, and perform upsert", async () => {
      mockTx.setting.findUnique.mockResolvedValue(null);
      mockTx.setting.upsert.mockResolvedValue({ id: "new_set", key, value });

      const result = await cmsRepo.upsertSetting(key, value, "actor_1");

      // Verify transaction options
      expect(prisma.$transaction).toHaveBeenCalledWith(
        expect.any(Function),
        { maxWait: 5000, timeout: 20000 }
      );

      // Verify revision creation is skipped
      expect(mockTx.settingRevision.create).not.toHaveBeenCalled();

      // Verify upsert payload
      expect(mockTx.setting.upsert).toHaveBeenCalledWith({
        where: { key },
        update: { value },
        create: { key, value },
      });

      expect(result).toEqual({ id: "new_set", key, value });
    });

    it("CMS-R06: should create settingRevision with old value if setting exists, then perform upsert", async () => {
      const existingSetting = { id: "old_set_1", key, value: { old: "data" } };
      mockTx.setting.findUnique.mockResolvedValue(existingSetting);
      mockTx.setting.upsert.mockResolvedValue({ id: "old_set_1", key, value });

      const result = await cmsRepo.upsertSetting(key, value, "actor_2");

      // Verify revision creation contains old data and actor ID
      expect(mockTx.settingRevision.create).toHaveBeenCalledWith({
        data: {
          settingId: existingSetting.id,
          value: existingSetting.value,
          actorId: "actor_2",
        },
      });

      expect(mockTx.setting.upsert).toHaveBeenCalledWith({
        where: { key },
        update: { value },
        create: { key, value },
      });

      expect(result).toEqual({ id: "old_set_1", key, value });
    });

    it("CMS-R07: should set actorId to null in revision if actorUserId is omitted", async () => {
      const existingSetting = { id: "old_set_2", key, value: { old: "data2" } };
      mockTx.setting.findUnique.mockResolvedValue(existingSetting);
      mockTx.setting.upsert.mockResolvedValue({ id: "old_set_2", key, value });

      // Call without actorUserId
      await cmsRepo.upsertSetting(key, value);

      expect(mockTx.settingRevision.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          actorId: null, // Should default to null
        }),
      });
    });

    it("CMS-R08: should propagate transaction/repository errors to the caller", async () => {
      const dbError = new Error("Transaction conflict");
      mockTx.setting.findUnique.mockRejectedValue(dbError);

      await expect(cmsRepo.upsertSetting(key, value, "actor_1")).rejects.toThrow("Transaction conflict");
      
      expect(mockTx.settingRevision.create).not.toHaveBeenCalled();
      expect(mockTx.setting.upsert).not.toHaveBeenCalled();
    });
  });
});