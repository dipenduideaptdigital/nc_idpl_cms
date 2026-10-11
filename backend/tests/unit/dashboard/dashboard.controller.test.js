import { describe, it, expect, vi, beforeEach } from "vitest";
import * as dashboardController from "../../../src/modules/dashboard/dashboard.controller.js";
import * as dashboardService from "../../../src/modules/dashboard/dashboard.service.js";
import { StatusCodes } from "http-status-codes";

// Mock the service
vi.mock("../../../src/modules/dashboard/dashboard.service.js");

describe("Dashboard Controller", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Express Request object
    req = {
      query: {},
      user: { id: "user_1", name: "Admin User" },
    };
    
    // Mock Express Response object
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
      setHeader: vi.fn(),
    };
    
    // Mock Express Next function
    next = vi.fn();
  });

  it("TC-1: getDashboardStatsController should map service data to API response format", async () => {
    // Service response with 'count' and 'growth'
    const mockServiceData = {
      unreadInquiries: 5,
      newInquiriesToday: 3,
      formEntries: { count: 50, growth: 10 },
      projects: { count: 20, growth: -5 },
      pages: { count: 15, growth: 0 },
      blogs: { count: 8, growth: 25 },
    };
    dashboardService.getDashboardMetrics.mockResolvedValue(mockServiceData);

    dashboardController.getDashboardStatsController(req, res, next);

    // Wait for the async handler to complete and call res.json
    await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

    expect(dashboardService.getDashboardMetrics).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    
    // Assert the mapped response structure (count -> value, growth -> trend)
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.success).toBe(true);
    expect(responseData.data).toEqual({
      unreadInquiries: 5,
      newInquiriesToday: 3,
      stats: {
        formEntries: { value: 50, trend: 10 },
        projects: { value: 20, trend: -5 },
        pages: { value: 15, trend: 0 },
        blogs: { value: 8, trend: 25 },
      }
    });
  });

  it("TC-2: getRecentEntriesController should forward query limit to service", async () => {
    req.query.limit = 8;
    const mockEntries = [{ id: "1", payload: {} }];
    dashboardService.getRecentFormEntries.mockResolvedValue(mockEntries);

    dashboardController.getRecentEntriesController(req, res, next);

    await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

    expect(dashboardService.getRecentFormEntries).toHaveBeenCalledWith(8);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.data).toEqual(mockEntries);
  });

  it("TC-3: getDashboardChartController should pass range and return chart data", async () => {
    req.query.range = "7D";
    const mockChartData = [{ date: "2026-10-01", count: 10 }];
    dashboardService.getLeadChartTimeline.mockResolvedValue(mockChartData);

    dashboardController.getDashboardChartController(req, res, next);

    await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

    expect(dashboardService.getLeadChartTimeline).toHaveBeenCalledWith("7D");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.data).toEqual(mockChartData);
  });

  it("TC-4: getDashboardActivityController should return activity list", async () => {
    const mockActivity = [
      { id: "note_1", type: "LEAD", text: "Test Activity", time: new Date() }
    ];
    dashboardService.getSystemGlobalActivity.mockResolvedValue(mockActivity);

    dashboardController.getDashboardActivityController(req, res, next);

    await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

    expect(dashboardService.getSystemGlobalActivity).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.data).toEqual(mockActivity);
  });

  it("TC-5: exportLeadsController should set CSV headers and send string data", async () => {
    const mockCSV = "Name,Email,Status\nJohn Doe,john@example.com,NEW";
    dashboardService.exportLeadsToCSV.mockResolvedValue(mockCSV);

    dashboardController.exportLeadsController(req, res, next);

    // This handler uses res.send instead of res.json
    await vi.waitFor(() => expect(res.send).toHaveBeenCalled());

    expect(dashboardService.exportLeadsToCSV).toHaveBeenCalledTimes(1);
    
    // Verify HTTP headers for CSV attachment
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv");
    expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", 'attachment; filename="leads_export.csv"');
    
    // Verify response body
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(mockCSV);
  });
});