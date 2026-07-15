import { z } from "zod";

export const previewTokenParamSchema = z.object({
  token: z.string().min(24, "Invalid preview token structure"),
});