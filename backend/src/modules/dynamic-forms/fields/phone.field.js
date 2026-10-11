import { z } from "zod";

export const PhoneField = {
  type: "phone",
  buildZodSchema: (fieldConfig) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    
    if (fieldConfig.required) {
      return z.string().trim()
        .min(1, `${fieldConfig.label} is required`)
        .regex(phoneRegex, "Invalid phone number format");
    } else {
      return z.union([
        z.string().trim().length(0),
        z.string().trim().regex(phoneRegex, "Invalid phone number format")
      ]).optional();
    }
  }
};