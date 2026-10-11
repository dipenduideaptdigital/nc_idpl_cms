import { z } from "zod";

export const dashboardChartQuerySchema = z.object({
  range: z.enum(["7D", "30D", "1Y"], {
    message: "Invalid range. Allowed values are 7D, 30D, or 1Y.",
  }).default("30D"),
});

export const dashboardRecentEntriesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(4),
});