import { z } from "zod";

export const TextareaField = {
  type: "textarea",
  buildZodSchema: (fieldConfig) => {
    let stringSchema = z.string().trim();
    
    if (fieldConfig.maxLength) {
      stringSchema = stringSchema.max(fieldConfig.maxLength, `${fieldConfig.label} cannot exceed ${fieldConfig.maxLength} characters`);
    }
    
    if (fieldConfig.required) {
      return stringSchema.min(1, `${fieldConfig.label} is required`);
    } else {
      return z.union([
        z.string().trim().length(0),
        stringSchema
      ]).optional();
    }
  }
};