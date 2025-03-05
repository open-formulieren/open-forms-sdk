import {FormioForm} from '@open-formulieren/formio-renderer';
import {fn} from '@storybook/test';

import {FormikDecorator} from 'story-utils/decorators';

import {FormioComponent} from './index';

export default {
  title: 'Private API / Formio',
  component: FormioComponent,
  args: {
    onSubmit: fn(),
    requiredFieldsWithAsterisk: true,
  },
};

const render = ({component, onSubmit, requiredFieldsWithAsterisk}) => (
  <FormioForm
    components={[component]}
    onSubmit={onSubmit}
    requiredFieldsWithAsterisk={requiredFieldsWithAsterisk}
  />
);

export const TextField = {
  render,
  args: {
    component: {
      key: 'textfield',
      type: 'textfield',
      label: 'Text field',
      validate: {
        required: true,
      },
    },
  },
};

export const EmailField = {
  render,
  args: {
    component: {
      key: 'email',
      type: 'email',
      label: 'Email field',
      validate: {
        required: true,
      },
    },
  },
};

export const DateField = {
  render,
  args: {
    component: {
      key: 'date',
      type: 'date',
      label: 'Datefield',
      validate: {
        required: true,
      },
      openForms: {
        widget: 'inputGroup',
      },
    },
  },
};

export const Radio = {
  render,
  args: {
    component: {
      key: 'radio',
      type: 'radio',
      label: 'Radio',
      validate: {
        required: true,
      },
      values: [
        {value: 'opt1', label: 'Option 1'},
        {value: 'opt2', label: 'Option 2'},
      ],
    },
  },
};

export const Checkbox = {
  render: args => <FormioComponent {...args} />,
  decorators: [FormikDecorator],
  args: {
    component: {
      key: 'checkbox',
      type: 'checkbox',
      label: 'Checkbox',
      validate: {
        required: true,
      },
    },
  },
};
