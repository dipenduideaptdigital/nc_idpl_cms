import { z } from "zod";

export const EmailField = {
  type: "email",
  buildZodSchema: (fieldConfig) => {
    if (fieldConfig.required) {
      return z.string().trim()
        .min(1, `${fieldConfig.label} is required`)
        .email(`Please enter a valid email for ${fieldConfig.label}`);
    } else {
      return z.union([
        z.string().trim().length(0),
        z.string().trim().email(`Please enter a valid email for ${fieldConfig.label}`)
      ]).optional();
    }
  }
};