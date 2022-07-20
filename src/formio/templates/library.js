import { default as ComponentTemplate } from './component.ejs';
import { default as FieldTemplate } from './field.ejs';
import { default as MessageTemplate } from './message.ejs';

import { default as ButtonTemplate } from './button.ejs';
import { default as CheckboxTemplate } from './checkbox.ejs';
import { default as ColumnsTemplate } from './columns.ejs';
import { default as LabelTemplate } from './label.ejs';
import { default as RadioTemplate } from './radio.ejs';
import { default as SelectTemplate } from './select.ejs';
import { default as SignatureTemplate } from './signature.ejs';
import { default as TextTemplate } from './text.ejs';
import { default as FieldSetTemplate } from './fieldset.ejs';
import { default as FileTemplate } from './file.ejs';
import { default as MapTemplate } from './map.ejs';
import { default as MultiValueRowTemplate } from './multiValueRow.ejs';
import { default as MultiValueTableTemplate } from './multiValueTable.ejs';
import { default as EditGridTemplate } from './editGrid.ejs';
import { default as EditGridRowTemplate } from './editGridRow.ejs';

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
  signature: {form: SignatureTemplate},
  input: {form: TextTemplate},
  fieldset: {form: FieldSetTemplate},
  file: {form: FileTemplate},
  map: {form: MapTemplate},
  multiValueRow: {form: MultiValueRowTemplate},
  multiValueTable: {form: MultiValueTableTemplate},
  editgrid: {form: EditGridTemplate},
  editgridrow: {form: EditGridRowTemplate},
};


export default OFLibrary;
