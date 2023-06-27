import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import DateField from './DateField';

export default {
  title: 'Pure React Components / Forms / DateField / Input group',
  component: DateField,
  decorators: [FormikDecorator],
  args: {
    widget: 'inputGroup',
    showFormattedDate: false,
    description: '',
    id: '',
    disabled: false,
  },
  argTypes: {
    minDate: {table: {disable: true}},
    maxDate: {table: {disable: true}},
    disabledDates: {table: {disable: true}},
    showFormattedDate: {control: 'boolean'},
  },
  parameters: {
    formik: {
      initialValues: {
        test: '2023-06-16',
      },
    },
  },
};

export const InputGroup = {
  name: 'Input group',
  args: {
    name: 'test',
    label: 'A memorable date',
    description: "What's your favourite date?",
    isRequired: false,
  },
};

export const NoAsterisks = {
  name: 'No asterisk for required',
  decorators: [ConfigDecorator],
  parameters: {
    config: {
      requiredFieldsWithAsterisk: false,
    },
  },
  args: {
    name: 'test',
    label: 'Default required',
    isRequired: true,
  },
};

export const WithValidationError = {
  name: 'With validation error',
  args: {
    name: 'test',
    label: 'When was the battle of Hastings?',
    isRequired: true,
  },
  parameters: {
    formik: {
      initialValues: {test: '1066-10-34'},
      initialErrors: {test: 'Invalid date entered'},
    },
  },
};
