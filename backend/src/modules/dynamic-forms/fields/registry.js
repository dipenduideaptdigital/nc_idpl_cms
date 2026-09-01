import { TextField } from "./text.field.js";
import { EmailField } from "./email.field.js";
import { TextareaField } from "./textarea.field.js";
import { PhoneField } from "./phone.field.js";
import { SelectField } from "./select.field.js";

const fields = [
  TextField,
  EmailField,
  TextareaField,
  PhoneField,
  SelectField
];

export const FieldRegistry = {
  isSupported: (type) => {
    return fields.some(f => f.type === type);
  },

  getZodBuilder: (type) => {
    const field = fields.find(f => f.type === type);
    if (!field) throw new Error(`Unsupported field type: ${type}`);
    return field.buildZodSchema;
  }
};