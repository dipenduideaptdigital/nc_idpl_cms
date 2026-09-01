import { TextField } from './fields/TextField';
import { EmailField } from './fields/EmailField';
import { TextareaField } from './fields/TextareaField';
import { PhoneField } from './fields/PhoneField';
import { SelectField } from './fields/SelectField';

export const FieldRegistry = {
  "text": { component: TextField, getDefaultValue: () => '' },
  "email": { component: EmailField, getDefaultValue: () => '' },
  "textarea": { component: TextareaField, getDefaultValue: () => '' },
  "phone": { component: PhoneField, getDefaultValue: () => '' },
  "select": { component: SelectField, getDefaultValue: () => '' },
};