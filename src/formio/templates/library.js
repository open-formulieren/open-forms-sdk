import { default as ComponentTemplate } from './component';
import { default as FieldTemplate } from './field';
import { default as MessageTemplate } from './message';

import { default as ButtonTemplate } from './button';
import { default as CheckboxTemplate } from './checkbox';
import { default as ColumnsTemplate } from './columns';
import { default as LabelTemplate } from './label';
import { default as RadioTemplate } from './radio';
import { default as SelectTemplate } from './select';
import { default as TextTemplate } from './text';
import { default as FieldSetTemplate } from './fieldset';
import { default as MapTemplate } from './map';
import { default as MultiValueRowTemplate } from './multiValueRow';
import { default as MultiValueTableTemplate } from './multiValueTable';

const OFLibrary = {
  component: {form: ComponentTemplate},
  field: {form: FieldTemplate}, // wrapper around the individual field types
  message: {form: MessageTemplate},

  button: {form: ButtonTemplate},
  checkbox: {form: CheckboxTemplate},
  columns: {form: ColumnsTemplate},
  label: {form: LabelTemplate},
  radio: {form: RadioTemplate},
  select: {form: SelectTemplate},
  input: {form: TextTemplate},
  fieldset: {form: FieldSetTemplate},
  map: {form: MapTemplate},
  multiValueRow: {form: MultiValueRowTemplate},
  multiValueTable: {form: MultiValueTableTemplate},
};


export default OFLibrary;
