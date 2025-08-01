import {default as AddressNLTemplate} from './addressNL.ejs';
import {default as ButtonTemplate} from './button.ejs';
import {default as CheckboxTemplate} from './checkbox.ejs';
import {default as ChildrenTemplate} from './children.ejs';
import {default as ColumnsTemplate} from './columns.ejs';
import {default as ComponentTemplate} from './component.ejs';
import {default as EditGridTemplate} from './editGrid.ejs';
import {default as EditGridRowTemplate} from './editGridRow.ejs';
import {default as FieldTemplate} from './field.ejs';
import {default as FieldSetTemplate} from './fieldset.ejs';
import {default as FileTemplate} from './file.ejs';
import {default as LabelTemplate} from './label.ejs';
import {default as MapTemplate} from './map.ejs';
import {default as MissingFieldsTemplate} from './missingFields.ejs';
import {default as MultiValueRowTemplate} from './multiValueRow.ejs';
import {default as MultiValueTableTemplate} from './multiValueTable.ejs';
import {default as PartnersTemplate} from './partners.ejs';
import {default as RadioTemplate} from './radio.ejs';
import {default as SelectTemplate} from './select.ejs';
import {default as SignatureTemplate} from './signature.ejs';
import {default as TextTemplate} from './text.ejs';

const OFLibrary = {
  component: {form: ComponentTemplate},
  field: {form: FieldTemplate}, // wrapper around the individual field types
  missingFields: {form: MissingFieldsTemplate},

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
  addressNL: {form: AddressNLTemplate},
  partners: {form: PartnersTemplate},
  children: {form: ChildrenTemplate},
};

export default OFLibrary;
