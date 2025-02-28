import {TextField} from '@open-formulieren/formio-renderer';
import {FormField, FormLabel, Textbox} from '@utrecht/component-library-react';
import {Field} from 'formik';

import {SelectField} from 'components/forms';
import {FormikDecorator} from 'story-utils/decorators';

import {InputGroup, InputGroupItem} from './InputGroup';

export default {
  title: 'Pure React Components / Forms / Low level / Input group',
  component: InputGroup,
  decorators: [FormikDecorator],
  argTypes: {
    children: {control: false},
  },
};

export const Basic = {
  render: args => (
    <InputGroup {...args}>
      <InputGroupItem>
        <FormLabel htmlFor="sub1" className="openforms-input-group__label">
          Sub 1
        </FormLabel>
        <Field as={Textbox} type="text" name="sub1" id="sub1" />
      </InputGroupItem>
      <InputGroupItem>
        <FormLabel htmlFor="sub2" className="openforms-input-group__label">
          Sub 2
        </FormLabel>
        <Field as={Textbox} type="text" name="sub2" id="sub2" />
      </InputGroupItem>
    </InputGroup>
  ),
  args: {
    label: 'Group related inputs',
    isRequired: false,
    disabled: false,
    invalid: false,
  },
};

export const InLargerForm = {
  render: args => (
    <div className="openforms-form-field-container">
      <TextField name="before" label="First field" />

      <FormField type="text" className="utrecht-form-field--openforms">
        <InputGroup {...args}>
          <InputGroupItem>
            <FormLabel htmlFor="sub1" className="openforms-input-group__label">
              Sub 1
            </FormLabel>
            <Field as={Textbox} name="inputGroup[0]" id="sub1" />
          </InputGroupItem>
          <InputGroupItem>
            <FormLabel htmlFor="sub2" className="openforms-input-group__label">
              Sub 2
            </FormLabel>
            <Field as={Textbox} name="inputGroup[1]" id="sub2" />
          </InputGroupItem>
        </InputGroup>
      </FormField>

      <SelectField
        name="after"
        options={[
          {value: 'opt1', label: 'Option 1'},
          {value: 'opt2', label: 'Option 2'},
        ]}
        label="Last field"
      />
    </div>
  ),
  args: {
    label: 'Group related inputs',
    isRequired: false,
    disabled: false,
    invalid: false,
  },
  parameters: {
    formik: {
      initialValues: {
        before: '',
        inputGroup: ['Jane', 'Doe'],
        after: 'opt1',
      },
    },
  },
};
