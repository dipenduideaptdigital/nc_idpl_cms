import { z } from "zod";

export const EmailField = {
  type: "email",
  
  buildZodSchema: (fieldConfig) => {
    let schema = z.string().trim().email(`Please enter a valid email for ${fieldConfig.label}`);
    
    if (fieldConfig.required) {
      schema = schema.min(1, `${fieldConfig.label} is required`);
    } else {
      schema = schema.optional().or(z.literal(''));
    }
    
    return schema;
  }
};