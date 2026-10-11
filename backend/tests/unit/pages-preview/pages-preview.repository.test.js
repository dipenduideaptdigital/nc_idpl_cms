import crypto from "crypto";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as previewRepo from "../../../src/modules/pages-preview/pages-preview.repository.js";
import { prisma } from "../../../src/config/db.js";

vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    $transaction: vi.fn(),
    pagePreviewToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    }
  }
}));

describe("Pages Preview Repository", () => {
  let mockTx;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTx = {
      pagePreviewToken: {
        deleteMany: vi.fn(),
        create: vi.fn(),
      }
    };

    // Make prisma.$transaction instantly execute the callback with the mockTx
    prisma.$transaction.mockImplementation(async (callback) => {
      return await callback(mockTx);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("replaceAndCreatePreviewToken()", () => {
    it("TC-01: should delete old tokens and create a new one with a hashed token inside a transaction", async () => {
      const rawToken = "my_super_secret_raw_token";
      const expectedHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      
      const payload = {
        token: rawToken,
        pageId: "page_1",
        createdById: "user_1",
        expiresAt: new Date("2026-12-31T23:59:59.000Z")
      };

      mockTx.pagePreviewToken.deleteMany.mockResolvedValue({ count: 1 });
      mockTx.pagePreviewToken.create.mockResolvedValue({ id: "token_1" });

      await previewRepo.replaceAndCreatePreviewToken(payload);

      // Verify transaction was called
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);

      // Verify old tokens are deleted for the page
      expect(mockTx.pagePreviewToken.deleteMany).toHaveBeenCalledWith({
        where: { pageId: "page_1" }
      });

      // Verify the new token is saved using the hashed value, NEVER the raw token
      expect(mockTx.pagePreviewToken.create).toHaveBeenCalledWith({
        data: {
          tokenHash: expectedHash,
          pageId: "page_1",
          createdById: "user_1",
          expiresAt: payload.expiresAt
        }
      });
      
      // Ensure raw token was not passed to the DB
      expect(mockTx.pagePreviewToken.create.mock.calls[0][0].data.tokenHash).not.toBe(rawToken);
    });

    it("TC-02: should propagate transaction failures", async () => {
      const dbError = new Error("Deadlock found");
      mockTx.pagePreviewToken.deleteMany.mockRejectedValue(dbError);

      await expect(previewRepo.replaceAndCreatePreviewToken({ pageId: "page_1", token: "abc" }))
        .rejects.toThrow("Deadlock found");
    });
  });

  describe("findTokenWithPageContext()", () => {
    it("TC-03: should hash the incoming token and query with required page context", async () => {
      const rawToken = "another_secret_token";
      const expectedHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      const mockDbResult = { id: "token_1", page: { id: "page_1" } };
      prisma.pagePreviewToken.findUnique.mockResolvedValue(mockDbResult);

      const result = await previewRepo.findTokenWithPageContext(rawToken);

      expect(prisma.pagePreviewToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: expectedHash }, // Queried with hash, not raw
        include: {
          page: {
            include: {
              author: { select: { name: true } },
              featuredImage: { select: { url: true, thumbnailUrl: true } }
            }
          }
        }
      });
      expect(result).toEqual(mockDbResult);
    });
  });

  describe("incrementTokenUsage()", () => {
    it("TC-04: should increment usedCount and set lastAccessedAt to the current time", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-10-10T12:00:00.000Z");
      vi.setSystemTime(now);

      prisma.pagePreviewToken.update.mockResolvedValue({ id: "token_1" });

      await previewRepo.incrementTokenUsage("token_1");

      expect(prisma.pagePreviewToken.update).toHaveBeenCalledWith({
        where: { id: "token_1" },
        data: {
          usedCount: { increment: 1 },
          lastAccessedAt: now
        }
      });
    });
  });

  describe("revokePreviewToken()", () => {
    it("TC-05: should call deleteMany with the correct page ID", async () => {
      prisma.pagePreviewToken.deleteMany.mockResolvedValue({ count: 2 });

      const result = await previewRepo.revokePreviewToken("page_1");

      expect(prisma.pagePreviewToken.deleteMany).toHaveBeenCalledWith({
        where: { pageId: "page_1" }
      });
      expect(result).toEqual({ count: 2 });
    });
  });

  describe("deleteExpiredTokens()", () => {
    it("TC-06: should delete tokens where expiresAt is strictly less than the current time", async () => {
      vi.useFakeTimers();
      const now = new Date("2026-10-10T12:00:00.000Z");
      vi.setSystemTime(now);

      prisma.pagePreviewToken.deleteMany.mockResolvedValue({ count: 5 });

      const result = await previewRepo.deleteExpiredTokens();

      expect(prisma.pagePreviewToken.deleteMany).toHaveBeenCalledWith({
        where: { expiresAt: { lt: now } }
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe("getPreviewTokenStats()", () => {
    it("TC-07: should query findUnique and strictly select the allowed statistical fields", async () => {
      const mockStats = { expiresAt: new Date(), usedCount: 3, lastAccessedAt: new Date(), createdAt: new Date() };
      prisma.pagePreviewToken.findUnique.mockResolvedValue(mockStats);

      const result = await previewRepo.getPreviewTokenStats("page_1");

      expect(prisma.pagePreviewToken.findUnique).toHaveBeenCalledWith({
        where: { pageId: "page_1" },
        select: {
          expiresAt: true,
          usedCount: true,
          lastAccessedAt: true,
          createdAt: true
        }
      });
      expect(result).toEqual(mockStats);
    });
  });
});