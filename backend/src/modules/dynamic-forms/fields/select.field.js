import { z } from "zod";

export const SelectField = {
  type: "select",
  
  buildZodSchema: (fieldConfig) => {
    let schema = z.string().trim();
    
    if (fieldConfig.required) {
      schema = schema.min(1, `Please select an option for ${fieldConfig.label}`);
    } else {
      schema = schema.optional().or(z.literal(''));
    }
    
    return schema;
  }
};