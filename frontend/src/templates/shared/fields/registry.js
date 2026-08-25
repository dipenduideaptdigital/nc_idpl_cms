import { TextField } from './TextField';
import { RichTextField } from './RichTextField';
import { ImageFieldWrapper } from './ImageFieldWrapper';
import { RepeaterField } from './RepeaterField';
import { SelectField } from './SelectField';
import { StyleBuilderField } from './StyleBuilderField';

export const fieldRegistry = {
  "text": TextField,
  "richtext": RichTextField,
  "image": ImageFieldWrapper,
  "repeater": RepeaterField,
  "select": SelectField,
  "styleBuilder": StyleBuilderField
};