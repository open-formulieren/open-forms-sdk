import { default as ComponentTemplate } from './component';
import { default as FieldTemplate } from './field';
import { default as MessageTemplate } from './message';

import { default as ButtonTemplate } from './button';
import { default as CheckboxTemplate } from './checkbox';
import { default as LabelTemplate } from './label';
import { default as RadioTemplate } from './radio';
import { default as SelectTemplate } from './select';
import { default as TextTemplate } from './text';
import { default as FieldSetTemplate } from './fieldset';
import { default as FileTemplate } from './file';

const OFLibrary = {
  component: {form: ComponentTemplate},
  field: {form: FieldTemplate}, // wrapper around the individual field types
  message: {form: MessageTemplate},
  file: {form: FileTemplate},
  button: {form: ButtonTemplate},
  checkbox: {form: CheckboxTemplate},
  label: {form: LabelTemplate},
  radio: {form: RadioTemplate},
  select: {form: SelectTemplate},
  input: {form: TextTemplate},
  fieldset: {form: FieldSetTemplate},
};


export default OFLibrary;
