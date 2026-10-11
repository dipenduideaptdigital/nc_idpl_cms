import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cmsService from "../../../src/modules/cms/cms.service.js";
import * as repo from "../../../src/modules/cms/cms.repository.js";

vi.mock("../../../src/modules/cms/cms.repository.js");

describe("CMS Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // getHomepageSection()
  describe("getHomepageSection()", () => {
    it("CS-01: should return the setting's value if the setting exists", async () => {
      const mockValue = { content: { title: "Welcome" } };
      repo.findSettingByKey.mockResolvedValue({ key: "homepage_general", value: mockValue });

      const result = await cmsService.getHomepageSection("homepage_general");

      expect(repo.findSettingByKey).toHaveBeenCalledWith("homepage_general");
      expect(result).toEqual(mockValue);
    });

    it("CS-02: should return default { content: {} } if setting does not exist", async () => {
      repo.findSettingByKey.mockResolvedValue(null);

      const result = await cmsService.getHomepageSection("missing_section");

      expect(result).toEqual({ content: {} });
    });

    it("CS-03: should return null if the setting record exists but its value is strictly null", async () => {
      repo.findSettingByKey.mockResolvedValue({ key: "some_section", value: null });

      const result = await cmsService.getHomepageSection("some_section");

      expect(result).toBeNull();
    });

    it("CS-04: should propagate the error if repository throws an error", async () => {
      const dbError = new Error("Database connection failed");
      repo.findSettingByKey.mockRejectedValue(dbError);

      await expect(cmsService.getHomepageSection("homepage_general")).rejects.toThrow("Database connection failed");
    });
  });

  // updateHomepageSection()
  describe("updateHomepageSection()", () => {
    it("CS-05 & CS-06: should forward arguments to repository and return updated value", async () => {
      const payload = { content: { title: "Updated Title" } };
      repo.upsertSetting.mockResolvedValue({ key: "homepage_general", value: payload });

      const result = await cmsService.updateHomepageSection("homepage_general", payload, "actor_123");

      expect(repo.upsertSetting).toHaveBeenCalledWith("homepage_general", payload, "actor_123");
      expect(result).toEqual(payload);
    });

    it("CS-07: should forward undefined as actorId if omitted", async () => {
      const payload = { content: {} };
      repo.upsertSetting.mockResolvedValue({ key: "some_section", value: payload });

      // Call without the 3rd argument
      await cmsService.updateHomepageSection("some_section", payload);

      expect(repo.upsertSetting).toHaveBeenCalledWith("some_section", payload, undefined);
    });

    it("CS-08: should propagate the error if repository throws an error during update", async () => {
      repo.upsertSetting.mockRejectedValue(new Error("Update failed"));

      await expect(
        cmsService.updateHomepageSection("homepage_general", { content: {} }, "actor_123")
      ).rejects.toThrow("Update failed");
    });
  });

  // getMultipleHomepageSections()
  describe("getMultipleHomepageSections()", () => {
    it("CS-09: should return each key mapped to its stored value when all exist", async () => {
      const requestedKeys = ["section_a", "section_b"];
      repo.findSettingsByKeys.mockResolvedValue([
        { key: "section_a", value: { content: { data: "A" } } },
        { key: "section_b", value: { content: { data: "B" } } }
      ]);

      const result = await cmsService.getMultipleHomepageSections(requestedKeys);

      expect(repo.findSettingsByKeys).toHaveBeenCalledWith(requestedKeys);
      expect(result).toEqual({
        section_a: { content: { data: "A" } },
        section_b: { content: { data: "B" } }
      });
    });

    it("CS-10: should return a default object for every requested key if none exist", async () => {
      const requestedKeys = ["section_a", "section_b"];
      repo.findSettingsByKeys.mockResolvedValue([]); // DB returns nothing

      const result = await cmsService.getMultipleHomepageSections(requestedKeys);

      expect(result).toEqual({
        section_a: { content: {} },
        section_b: { content: {} }
      });
    });

    it("CS-11: should return stored values for existing keys and defaults for missing keys", async () => {
      const requestedKeys = ["homepage_general", "homepage_footer", "nc_homepage_hero"];
      
      // DB only returns 2 out of 3 requested settings
      repo.findSettingsByKeys.mockResolvedValue([
        { key: "homepage_general", value: { title: "Welcome" } },
        { key: "nc_homepage_hero", value: { heading: "Discover Nature" } }
      ]);

      const result = await cmsService.getMultipleHomepageSections(requestedKeys);

      expect(result).toEqual({
        homepage_general: { title: "Welcome" },
        homepage_footer: { content: {} }, // Default generated for missing key
        nc_homepage_hero: { heading: "Discover Nature" }
      });
    });

    it("CS-12: should return empty object when the requested keys array is empty", async () => {
      repo.findSettingsByKeys.mockResolvedValue([]);

      const result = await cmsService.getMultipleHomepageSections([]);

      expect(repo.findSettingsByKeys).toHaveBeenCalledWith([]);
      expect(result).toEqual({});
    });

    it("CS-13: should propagate the error if repository throws an error on multiple lookup", async () => {
      repo.findSettingsByKeys.mockRejectedValue(new Error("Multi-fetch failed"));

      await expect(
        cmsService.getMultipleHomepageSections(["section_a"])
      ).rejects.toThrow("Multi-fetch failed");
    });
  });
});