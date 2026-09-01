import { z } from "zod";

export const PhoneField = {
  type: "phone",
  
  buildZodSchema: (fieldConfig) => {
    let schema = z.string().trim();

    if (fieldConfig.required) {
      schema = schema.min(1, `${fieldConfig.label} is required`)
                     .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format");
    } else {
      // If not required, it can be empty, but if provided, it must be valid
      schema = z.union([
        z.literal(''),
        z.string().trim().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format")
      ]).optional();
    }
    
    return schema;
  }
};