import { z } from "zod";

export const TextField = {
  type: "text",
  buildZodSchema: (fieldConfig) => {
    let stringSchema = z.string().trim();
    
    if (fieldConfig.minLength) {
      stringSchema = stringSchema.min(fieldConfig.minLength, `${fieldConfig.label} must be at least ${fieldConfig.minLength} characters`);
    }
    if (fieldConfig.maxLength) {
      stringSchema = stringSchema.max(fieldConfig.maxLength, `${fieldConfig.label} cannot exceed ${fieldConfig.maxLength} characters`);
    }
    
    if (fieldConfig.required) {
      if (!fieldConfig.minLength) {
        stringSchema = stringSchema.min(1, `${fieldConfig.label} is required`);
      }
      return stringSchema;
    } else {
      return z.union([
        z.string().trim().length(0),
        stringSchema
      ]).optional();
    }
  }
};