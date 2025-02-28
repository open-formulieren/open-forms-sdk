import {FormikDecorator} from 'story-utils/decorators';

import {FormioComponent} from './index';

export default {
  title: 'Private API / Formio',
  component: FormioComponent,
  decorators: [FormikDecorator],
};

export const TextField = {
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
