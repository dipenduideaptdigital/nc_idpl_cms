import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as dashboardService from "../../../src/modules/dashboard/dashboard.service.js";
import { prisma } from "../../../src/config/db.js";

// Mock Prisma
vi.mock("../../../src/config/db.js", () => ({
  prisma: {
    formSubmission: { count: vi.fn(), findMany: vi.fn() },
    project: { count: vi.fn() },
    page: { count: vi.fn() },
    blog: { count: vi.fn() },
    formSubmissionNote: { findMany: vi.fn() },
    blogRevision: { findMany: vi.fn() },
    pageRevision: { findMany: vi.fn() },
    contactSubmission: { findMany: vi.fn() },
    $queryRaw: vi.fn(),
  },
}));

describe("Dashboard Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Dashboard Metrics
  describe("getDashboardMetrics()", () => {
    const setupDefaultCounts = () => {
      prisma.project.count.mockResolvedValue(10);
      prisma.page.count.mockResolvedValue(10);
      prisma.blog.count.mockResolvedValue(10);
      
      prisma.formSubmission.count.mockImplementation(async ({ where }) => {
        if (where.isViewed === false) return 5;
        if (where.createdAt?.lt) return 10;
        if (where.createdAt?.gte) {
          if (where.createdAt.gte.getDate() === 1) return 15;
          return 3;
        }
        return 50;
      });
    };

    it("TC-1: should return correct dashboard metric structure and counts", async () => {
      setupDefaultCounts();
      const result = await dashboardService.getDashboardMetrics();
      
      expect(result.unreadInquiries).toBe(5);
      expect(result.newInquiriesToday).toBe(3);
      expect(result.formEntries.count).toBe(50);
      expect(result.formEntries.growth).toBe(50); // (15 - 10) / 10 * 100
    });

    it("TC-2: should apply correct business filters for models", async () => {
      setupDefaultCounts();
      await dashboardService.getDashboardMetrics();

      // Form Entries Filter
      expect(prisma.formSubmission.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ deletedAt: null }) })
      );
      // Project Filter
      expect(prisma.project.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: "PUBLISHED" }) })
      );
      // Page Filter
      expect(prisma.page.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: "PUBLISHED", deletedAt: null }) })
      );
    });

    it("TC-3: should pass correct start and previous month dates for month-over-month growth", async () => {
      vi.useFakeTimers();
      const mockTime = new Date();
      mockTime.setFullYear(2026, 9, 15); // Oct 15, 2026 local time
      vi.setSystemTime(mockTime);
      setupDefaultCounts();

      await dashboardService.getDashboardMetrics();

      const expectedCurrentStart = new Date(2026, 9, 1); // Oct 1 local time
      const expectedPrevStart = new Date(2026, 8, 1); // Sept 1 local time

      // Checking one of the growth models (e.g., project)
      expect(prisma.project.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ createdAt: { gte: expectedCurrentStart } }) })
      );
      expect(prisma.project.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ createdAt: { gte: expectedPrevStart, lt: expectedCurrentStart } }) })
      );
    });

    it("TC-4: should correctly calculate growth edge cases (positive, negative, zero to positive, zero to zero, rounding)", async () => {
      const testCases = [
        { total: 50, current: 15, prev: 10, expectedGrowth: 50 },
        { total: 50, current: 5, prev: 10, expectedGrowth: -50 },
        { total: 50, current: 4, prev: 0, expectedGrowth: 100 },
        { total: 50, current: 0, prev: 0, expectedGrowth: 0 },
        { total: 50, current: 4, prev: 3, expectedGrowth: 33 }, // 33.33 -> 33 (Rounded)
      ];

      for (const tc of testCases) {
        vi.clearAllMocks();
        // mock project count to test the internal calculateGrowth helper behavior
        prisma.project.count.mockImplementation(async ({ where }) => {
          if (where?.createdAt?.lt) return tc.prev;
          if (where?.createdAt?.gte) return tc.current;
          return tc.total;
        });
        prisma.formSubmission.count.mockResolvedValue(0);
        prisma.page.count.mockResolvedValue(0);
        prisma.blog.count.mockResolvedValue(0);

        const result = await dashboardService.getDashboardMetrics();
        expect(result.projects.count).toBe(tc.total);
        expect(result.projects.growth).toBe(tc.expectedGrowth);
      }
    });

    it("TC-5: should calculate today's inquiry boundary correctly from midnight", async () => {
      vi.useFakeTimers();
      const mockTime = new Date();
      mockTime.setFullYear(2026, 9, 15);
      mockTime.setHours(10, 30, 0, 0); // Local time
      vi.setSystemTime(mockTime);
      setupDefaultCounts();

      await dashboardService.getDashboardMetrics();

      const todayMidnight = new Date(mockTime);
      todayMidnight.setHours(0, 0, 0, 0);
      
      expect(prisma.formSubmission.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdAt: { gte: todayMidnight }, deletedAt: null }
        })
      );
    });

    it("TC-6: should reject if any Prisma count query fails", async () => {
      setupDefaultCounts();
      prisma.project.count.mockRejectedValue(new Error("Database timeout"));
      await expect(dashboardService.getDashboardMetrics()).rejects.toThrow("Database timeout");
    });
  });

  // Activity Timeline
  describe("getSystemGlobalActivity()", () => {
    it("TC-12: should map each activity source to the correct unified format", async () => {
      const mockTime = new Date("2026-10-10T10:00:00Z");
      prisma.formSubmissionNote.findMany.mockResolvedValue([{ id: "1", createdAt: mockTime, author: { name: "Alice" }, submission: { form: { title: "Contact" } } }]);
      prisma.blogRevision.findMany.mockResolvedValue([{ id: "2", createdAt: mockTime, actor: { name: "Bob" }, blog: { title: "My Blog" } }]);
      prisma.pageRevision.findMany.mockResolvedValue([{ id: "3", createdAt: mockTime, actor: { name: "Charlie" }, page: { title: "Home" } }]);

      const result = await dashboardService.getSystemGlobalActivity();
      
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([
        { id: "note_1", type: "LEAD", text: 'Alice added a note to "Contact" entry.', time: mockTime },
        { id: "blog_2", type: "BLOG", text: 'Bob updated blog: "My Blog"', time: mockTime },
        { id: "page_3", type: "PAGE", text: 'Charlie updated page: "Home"', time: mockTime },
      ]));
    });

    it("TC-13: should handle missing authors with fallbacks safely", async () => {
      prisma.formSubmissionNote.findMany.mockResolvedValue([{ id: "1", createdAt: new Date(), author: null, submission: { form: { title: "F1" } } }]);
      prisma.blogRevision.findMany.mockResolvedValue([{ id: "2", createdAt: new Date(), actor: null, blog: { title: "B1" } }]);
      prisma.pageRevision.findMany.mockResolvedValue([{ id: "3", createdAt: new Date(), actor: null, page: { title: "P1" } }]);

      const result = await dashboardService.getSystemGlobalActivity();
      
      expect(result.find(r => r.type === "LEAD").text).toContain("Admin added a note");
      expect(result.find(r => r.type === "BLOG").text).toBe('Blog "B1" was modified');
      expect(result.find(r => r.type === "PAGE").text).toBe('Page "P1" was modified');
    });

    it("TC-14 & TC-15: should sort globally by newest and limit exactly to 10", async () => {
      const createMockArray = (prefix, count) => Array.from({ length: count }).map((_, i) => ({
        id: `${prefix}_${i}`,
        createdAt: new Date(Date.now() - i * 10000), // Staggered times
        author: { name: "Test" }, actor: { name: "Test" },
        submission: { form: { title: "T" } }, blog: { title: "T" }, page: { title: "T" }
      }));

      // Return 10 from each source (total 30)
      prisma.formSubmissionNote.findMany.mockResolvedValue(createMockArray("note", 10));
      prisma.blogRevision.findMany.mockResolvedValue(createMockArray("blog", 10));
      prisma.pageRevision.findMany.mockResolvedValue(createMockArray("page", 10));

      const result = await dashboardService.getSystemGlobalActivity();
      
      expect(result).toHaveLength(10);
      expect(new Date(result[0].time).getTime()).toBeGreaterThanOrEqual(new Date(result[1].time).getTime());
    });

    it("TC-16: should return empty array if no records exist and reject on DB failure", async () => {
      prisma.formSubmissionNote.findMany.mockResolvedValue([]);
      prisma.blogRevision.findMany.mockResolvedValue([]);
      prisma.pageRevision.findMany.mockResolvedValue([]);

      const emptyResult = await dashboardService.getSystemGlobalActivity();
      expect(emptyResult).toEqual([]);

      prisma.formSubmissionNote.findMany.mockRejectedValue(new Error("DB Down"));
      await expect(dashboardService.getSystemGlobalActivity()).rejects.toThrow("DB Down");
    });
  });

  //CSV Export
  describe("exportLeadsToCSV()", () => {
    it("TC-17 & TC-18: should correctly structure header and map fully populated lead data", async () => {
      const mockDate = new Date("2026-05-10T12:00:00Z");
      prisma.contactSubmission.findMany.mockResolvedValue([{
        name: "John Doe", email: "john@example.com", phone: "1234567890",
        website: "https://john.com", subject: "Inquiry", message: "Hello",
        sourcePage: "/contact", status: "NEW", spamScore: 0.1,
        createdAt: mockDate, ipAddress: "192.168.1.1"
      }]);

      const csv = await dashboardService.exportLeadsToCSV();
      const rows = csv.split("\n");
      
      expect(rows[0]).toBe("Name,Email,Phone,Website,Subject,Message,Source Page,Status,Spam Score,Date Submitted,IP Address");
      expect(rows[1]).toBe('"John Doe","john@example.com","1234567890","https://john.com","Inquiry","Hello","/contact","NEW","0.1","2026-05-10","192.168.1.1"');
    });

    it("TC-19: should substitute N/A for optional missing values", async () => {
      prisma.contactSubmission.findMany.mockResolvedValue([{
        name: "Jane", email: "jane@example.com", status: "RESOLVED", spamScore: 0, createdAt: new Date("2026-01-01T00:00:00Z"),
        // Missing phone, website, subject, message, sourcePage, ipAddress
      }]);

      const csv = await dashboardService.exportLeadsToCSV();
      const dataRow = csv.split("\n")[1];
      expect(dataRow).toBe('"Jane","jane@example.com","N/A","N/A","N/A","N/A","N/A","RESOLVED","0","2026-01-01","N/A"');
    });

    it("TC-20 & TC-21: should escape double quotes, wrap in quotes, and format dates correctly", async () => {
      prisma.contactSubmission.findMany.mockResolvedValue([{
        name: 'John "The Boss" Doe', email: "test,test@test.com", message: "Line1\nLine2",
        status: "NEW", spamScore: -0.5, createdAt: new Date("2026-12-31T23:59:59Z")
      }]);

      const csv = await dashboardService.exportLeadsToCSV();
      
      expect(csv).toContain('"John ""The Boss"" Doe"');
      expect(csv).toContain('"test,test@test.com"');
      expect(csv).toContain('"Line1\nLine2"');
      expect(csv).toContain('"-0.5"');
      expect(csv).toContain('"2026-12-31"'); // TC-21 Date format
    });

    it("TC-22: should return only headers if dataset is empty", async () => {
      prisma.contactSubmission.findMany.mockResolvedValue([]);
      const csv = await dashboardService.exportLeadsToCSV();
      
      expect(csv.split("\n").length).toBe(1);
      expect(csv).toContain("Name,Email");
    });

    it("TC-23 & TC-24: should query correctly and propagate database errors", async () => {
      prisma.contactSubmission.findMany.mockResolvedValue([]);
      await dashboardService.exportLeadsToCSV();
      
      expect(prisma.contactSubmission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" }
        })
      );

      prisma.contactSubmission.findMany.mockRejectedValue(new Error("Timeout"));
      await expect(dashboardService.exportLeadsToCSV()).rejects.toThrow("Timeout");
    });
  });

  // Chart and Recent Entries
  describe("getLeadChartTimeline()", () => {
    it("TC-7 & TC-8: should subtract days correctly based on range (7D, 1Y, and default 30D)", async () => {
      vi.useFakeTimers();
      const mockNow = new Date();
      mockNow.setFullYear(2026, 9, 15);
      mockNow.setHours(12, 0, 0, 0);
      vi.setSystemTime(mockNow);
      prisma.$queryRaw.mockResolvedValue([]);

      const getExpectedDate = (daysToSubtract) => {
        const d = new Date(mockNow);
        d.setDate(d.getDate() - daysToSubtract);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };

      await dashboardService.getLeadChartTimeline("7D");
      const call7D = prisma.$queryRaw.mock.calls[0][1]; 
      expect(call7D.getTime()).toBe(getExpectedDate(7)); 

      await dashboardService.getLeadChartTimeline("1Y");
      const call1Y = prisma.$queryRaw.mock.calls[1][1];
      expect(call1Y.getTime()).toBe(getExpectedDate(365)); 

      await dashboardService.getLeadChartTimeline("UNKNOWN");
      const call30D = prisma.$queryRaw.mock.calls[2][1];
      expect(call30D.getTime()).toBe(getExpectedDate(30)); 
    });

    it("TC-9: should correctly transform DB results into ISO dates and numbers", async () => {
      prisma.$queryRaw.mockResolvedValue([
        { date: new Date("2026-10-01T00:00:00Z"), count: 5n },
        { date: new Date("2026-10-02T00:00:00Z"), count: "12" }
      ]);

      const result = await dashboardService.getLeadChartTimeline("30D");
      
      expect(result).toEqual([
        { date: "2026-10-01", count: 5 },
        { date: "2026-10-02", count: 12 }
      ]);
    });

    it("TC-10 & TC-11: should return empty array on no results, and propagate errors", async () => {
      prisma.$queryRaw.mockResolvedValue([]);
      expect(await dashboardService.getLeadChartTimeline("7D")).toEqual([]);

      prisma.$queryRaw.mockRejectedValue(new Error("SQL Error"));
      await expect(dashboardService.getLeadChartTimeline("7D")).rejects.toThrow("SQL Error");
    });
  });

  describe("getRecentFormEntries()", () => {
    it("TC-25: should use default limit 4 if not provided", async () => {
      prisma.formSubmission.findMany.mockResolvedValue([]);
      await dashboardService.getRecentFormEntries();
      
      expect(prisma.formSubmission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 4 })
      );
    });

    it("TC-26 & TC-27: should use provided numeric or string limits", async () => {
      prisma.formSubmission.findMany.mockResolvedValue([]);
      
      await dashboardService.getRecentFormEntries(8);
      expect(prisma.formSubmission.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 8 }));

      await dashboardService.getRecentFormEntries("15");
      expect(prisma.formSubmission.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 15 }));
    });

    it("TC-28: should follow query contract (filters, includes, ordering) and propagate errors", async () => {
      prisma.formSubmission.findMany.mockResolvedValue([]);
      await dashboardService.getRecentFormEntries(5);
      
      expect(prisma.formSubmission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: { form: { select: { title: true } } }
        })
      );

      prisma.formSubmission.findMany.mockRejectedValue(new Error("Failed fetching entries"));
      await expect(dashboardService.getRecentFormEntries(5)).rejects.toThrow("Failed fetching entries");
    });
  });
});