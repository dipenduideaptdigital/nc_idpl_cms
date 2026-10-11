import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as previewService from "../../../src/modules/pages-preview/pages-preview.service.js";
import * as pageRepo from "../../../src/modules/pages/pages.repository.js";
import * as previewRepo from "../../../src/modules/pages-preview/pages-preview.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

// Mock dependencies
vi.mock("../../../src/modules/pages/pages.repository.js");
vi.mock("../../../src/modules/pages-preview/pages-preview.repository.js");

describe("Pages Preview Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("generatePreviewLink()", () => {
    const mockPageId = "page_123";
    const mockUserId = "user_456";
    const baseUrl = "https://example.com";

    it("TC-01: should throw 404 AppError if page does not exist", async () => {
      pageRepo.findPageById.mockResolvedValue(null);

      await expect(previewService.generatePreviewLink(mockPageId, mockUserId, baseUrl))
        .rejects.toThrow(AppError);
      
      expect(pageRepo.findPageById).toHaveBeenCalledWith(mockPageId);
      expect(previewRepo.replaceAndCreatePreviewToken).not.toHaveBeenCalled();
    });

    it("TC-02: should generate a valid preview link with a 64-char hex token", async () => {
      pageRepo.findPageById.mockResolvedValue({ id: mockPageId });
      previewRepo.replaceAndCreatePreviewToken.mockResolvedValue(true);

      const result = await previewService.generatePreviewLink(mockPageId, mockUserId, baseUrl);

      expect(result).toHaveProperty("previewUrl");
      expect(result.previewUrl).toMatch(/^https:\/\/example\.com\/preview\/[a-f0-9]{64}$/);
      expect(previewRepo.replaceAndCreatePreviewToken).toHaveBeenCalledTimes(1);
    });

    it("TC-03: should set token expiry to exactly 24 hours from creation", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-01-01T12:00:00.000Z");
      vi.setSystemTime(now);

      pageRepo.findPageById.mockResolvedValue({ id: mockPageId });
      previewRepo.replaceAndCreatePreviewToken.mockResolvedValue(true);

      await previewService.generatePreviewLink(mockPageId, mockUserId, baseUrl);

      const expectedExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

      expect(previewRepo.replaceAndCreatePreviewToken).toHaveBeenCalledWith(
        expect.objectContaining({
          pageId: mockPageId,
          createdById: mockUserId,
          expiresAt: expectedExpiry,
        })
      );
    });

    it("TC-04: should replace existing preview token", async () => {
      pageRepo.findPageById.mockResolvedValue({ id: mockPageId });
      previewRepo.replaceAndCreatePreviewToken.mockResolvedValue(true);

      await previewService.generatePreviewLink(mockPageId, mockUserId, baseUrl);

      // Verify delegation to repo which handles replacement transaction
      expect(previewRepo.replaceAndCreatePreviewToken).toHaveBeenCalledWith(
        expect.objectContaining({ pageId: mockPageId, createdById: mockUserId })
      );
    });

    it("TC-05: should propagate error if repository fails to create token", async () => {
      pageRepo.findPageById.mockResolvedValue({ id: mockPageId });
      const dbError = new Error("Database transaction failed");
      previewRepo.replaceAndCreatePreviewToken.mockRejectedValue(dbError);

      await expect(previewService.generatePreviewLink(mockPageId, mockUserId, baseUrl))
        .rejects.toThrow("Database transaction failed");
    });
  });

  describe("resolvePreviewToken()", () => {
    const mockToken = "some_random_token_string";

    it("TC-06: should throw 404 AppError for invalid or unknown token", async () => {
      previewRepo.findTokenWithPageContext.mockResolvedValue(null);

      await expect(previewService.resolvePreviewToken(mockToken))
        .rejects.toThrow(AppError);
      
      expect(previewRepo.incrementTokenUsage).not.toHaveBeenCalled();
    });

    it("TC-07: should throw 410 AppError if token has expired", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));

      const expiredTokenRecord = {
        id: "token_1",
        expiresAt: new Date("2026-01-01T12:00:00.000Z"), // Past date
        page: { id: "page_1" }
      };
      previewRepo.findTokenWithPageContext.mockResolvedValue(expiredTokenRecord);

      await expect(previewService.resolvePreviewToken(mockToken))
        .rejects.toThrowError(new AppError("Preview expired.", 410));
      
      expect(previewRepo.incrementTokenUsage).not.toHaveBeenCalled();
    });

    it("TC-08: should throw 404 AppError if the page is deleted", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

      const activeTokenWithDeletedPage = {
        id: "token_1",
        expiresAt: new Date("2026-01-02T10:00:00.000Z"), // Future date
        page: { id: "page_1", deletedAt: new Date() } // Page is deleted
      };
      previewRepo.findTokenWithPageContext.mockResolvedValue(activeTokenWithDeletedPage);

      await expect(previewService.resolvePreviewToken(mockToken))
        .rejects.toThrowError(new AppError("Page deleted.", 404));
      
      expect(previewRepo.incrementTokenUsage).not.toHaveBeenCalled();
    });

    it("TC-09: should return serialized page and trigger asynchronous usage tracking", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

      const validTokenRecord = {
        id: "token_1",
        expiresAt: new Date("2026-01-02T10:00:00.000Z"),
        page: { id: "page_1", title: "Test Page", status: "DRAFT" }
      };
      
      previewRepo.findTokenWithPageContext.mockResolvedValue(validTokenRecord);
      previewRepo.incrementTokenUsage.mockResolvedValue(true);

      const result = await previewService.resolvePreviewToken(mockToken);

      expect(result.preview.enabled).toBe(true);
      expect(result.preview.expiresAt).toEqual(validTokenRecord.expiresAt);
      expect(result.page.id).toBe("page_1");
      
      // Checking fire-and-forget behavior
      expect(previewRepo.incrementTokenUsage).toHaveBeenCalledWith("token_1");
    });

    it("TC-10: should not fail preview resolution if usage tracking fails (fire-and-forget)", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));
      
      // Spy on console.error to prevent test output noise
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const validTokenRecord = {
        id: "token_1",
        expiresAt: new Date("2026-01-02T10:00:00.000Z"),
        page: { id: "page_1", title: "Test Page", status: "DRAFT" }
      };
      
      previewRepo.findTokenWithPageContext.mockResolvedValue(validTokenRecord);
      previewRepo.incrementTokenUsage.mockRejectedValue(new Error("Usage tracking DB error"));

      const result = await previewService.resolvePreviewToken(mockToken);

      expect(result.page.id).toBe("page_1"); // Still returns successfully
      expect(previewRepo.incrementTokenUsage).toHaveBeenCalled();
      
      // Wait for next tick to let unhandled promise rejection log out
      await new Promise(process.nextTick);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it("TC-11: should propagate error if token lookup fails", async () => {
      previewRepo.findTokenWithPageContext.mockRejectedValue(new Error("Database connection lost"));

      await expect(previewService.resolvePreviewToken(mockToken))
        .rejects.toThrow("Database connection lost");
    });
  });

  describe("revokePreviewLink()", () => {
    it("TC-12: should return repository result on successful revocation", async () => {
      previewRepo.revokePreviewToken.mockResolvedValue({ count: 1 });
      const result = await previewService.revokePreviewLink("page_1");
      expect(result).toEqual({ count: 1 });
      expect(previewRepo.revokePreviewToken).toHaveBeenCalledWith("page_1");
    });

    it("TC-13: should propagate error on repository failure", async () => {
      previewRepo.revokePreviewToken.mockRejectedValue(new Error("Delete failed"));
      await expect(previewService.revokePreviewLink("page_1"))
        .rejects.toThrow("Delete failed");
    });
  });

  describe("getPreviewLinkStatus()", () => {
    it("TC-14: should return isActive false when no token statistics exist", async () => {
      previewRepo.getPreviewTokenStats.mockResolvedValue(null);
      const result = await previewService.getPreviewLinkStatus("page_1");
      expect(result).toEqual({ isActive: false });
    });

    it("TC-15: should return isActive false and isExpired true if token is expired", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));

      previewRepo.getPreviewTokenStats.mockResolvedValue({
        expiresAt: new Date("2026-01-01T12:00:00.000Z") // Past
      });

      const result = await previewService.getPreviewLinkStatus("page_1");
      expect(result).toEqual({ isActive: false, isExpired: true });
    });

    it("TC-16: should return active status details for an unexpired token", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

      const mockStats = {
        expiresAt: new Date("2026-01-02T10:00:00.000Z"), // Future
        usedCount: 5,
        lastAccessedAt: new Date("2026-01-01T09:00:00.000Z"),
        createdAt: new Date("2026-01-01T08:00:00.000Z")
      };
      previewRepo.getPreviewTokenStats.mockResolvedValue(mockStats);

      const result = await previewService.getPreviewLinkStatus("page_1");
      expect(result).toEqual({
        isActive: true,
        expiresAt: mockStats.expiresAt,
        usedCount: mockStats.usedCount,
        lastAccessedAt: mockStats.lastAccessedAt,
        createdAt: mockStats.createdAt
      });
    });

    it("TC-17: should propagate error if statistics lookup fails", async () => {
      previewRepo.getPreviewTokenStats.mockRejectedValue(new Error("Lookup failed"));
      await expect(previewService.getPreviewLinkStatus("page_1"))
        .rejects.toThrow("Lookup failed");
    });
  });
});