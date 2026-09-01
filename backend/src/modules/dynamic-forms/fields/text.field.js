import { z } from "zod";

export const TextField = {
  type: "text",
  
  buildZodSchema: (fieldConfig) => {
    let schema = z.string().trim();
    
    if (fieldConfig.required) {
      schema = schema.min(1, `${fieldConfig.label} is required`);
    } else {
      schema = schema.optional().or(z.literal(''));
    }
    
    // Optional min/max constraints from settings
    if (fieldConfig.minLength) schema = schema.min(fieldConfig.minLength, `${fieldConfig.label} must be at least ${fieldConfig.minLength} characters`);
    if (fieldConfig.maxLength) schema = schema.max(fieldConfig.maxLength, `${fieldConfig.label} cannot exceed ${fieldConfig.maxLength} characters`);
    
    return schema;
  }
};