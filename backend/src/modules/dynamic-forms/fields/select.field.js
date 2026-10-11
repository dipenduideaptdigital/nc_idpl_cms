import { z } from "zod";

export const SelectField = {
  type: "select",
  buildZodSchema: (fieldConfig) => {
    if (fieldConfig.required) {
      return z.string().trim().min(1, `Please select an option for ${fieldConfig.label}`);
    } else {
      return z.union([
        z.string().trim().length(0),
        z.string().trim()
      ]).optional();
    }
  }
};