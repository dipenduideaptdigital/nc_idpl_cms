import { z } from "zod";

export const dashboardChartQuerySchema = z.object({
  range: z.enum(["7D", "30D", "1Y"], {
    errorMap: () => ({ message: "Security Validation Failed: Invalid timeline range parameter constraint." })
  }).default("30D")
});