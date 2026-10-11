import { describe, it, expect } from "vitest";
import { 
  dashboardChartQuerySchema, 
  dashboardRecentEntriesQuerySchema 
} from "../../../src/modules/dashboard/dashboard.validation.js";

describe("Dashboard Validation Schemas", () => {
  
  describe("dashboardChartQuerySchema", () => {
    it("should accept valid ranges (7D, 30D, 1Y)", () => {
      expect(dashboardChartQuerySchema.parse({ range: "7D" })).toEqual({ range: "7D" });
      expect(dashboardChartQuerySchema.parse({ range: "30D" })).toEqual({ range: "30D" });
      expect(dashboardChartQuerySchema.parse({ range: "1Y" })).toEqual({ range: "1Y" });
    });

    it("should default to 30D if range is not provided", () => {
      expect(dashboardChartQuerySchema.parse({})).toEqual({ range: "30D" });
    });

    it("should reject invalid ranges or empty strings", () => {
      const resultInvalid = dashboardChartQuerySchema.safeParse({ range: "90D" });
      expect(resultInvalid.success).toBe(false);
      
      const resultEmpty = dashboardChartQuerySchema.safeParse({ range: "" });
      expect(resultEmpty.success).toBe(false);
    });
  });

  describe("dashboardRecentEntriesQuerySchema", () => {
    it("should default to 4 if limit is not provided", () => {
      expect(dashboardRecentEntriesQuerySchema.parse({})).toEqual({ limit: 4 });
    });

    it("should convert string representation of numbers to numbers", () => {
      expect(dashboardRecentEntriesQuerySchema.parse({ limit: "8" })).toEqual({ limit: 8 });
    });

    it("should reject invalid, negative, decimal, and limits above maximum configured (20)", () => {
      const invalidCases = ["abc", "-1", "0", "5.5", "21", "100000"];
      
      for (const val of invalidCases) {
        const result = dashboardRecentEntriesQuerySchema.safeParse({ limit: val });
        expect(result.success).toBe(false);
      }
    });
  });
  
});