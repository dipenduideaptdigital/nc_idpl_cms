import { z } from "zod";

export const TextareaField = {
  type: "textarea",
  
  buildZodSchema: (fieldConfig) => {
    let schema = z.string().trim();
    
    if (fieldConfig.required) {
      schema = schema.min(1, `${fieldConfig.label} is required`);
    } else {
      schema = schema.optional().or(z.literal(''));
    }
    
    if (fieldConfig.maxLength) {
      schema = schema.max(fieldConfig.maxLength, `${fieldConfig.label} cannot exceed ${fieldConfig.maxLength} characters`);
    }
    
    return schema;
  }
};