import {FormioForm} from '@open-formulieren/formio-renderer';
import {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

export default {
  title: 'Private API / Formio',
  component: FormioForm,
  args: {
    onSubmit: fn(),
    requiredFieldsWithAsterisk: true,
  },
} satisfies Meta<typeof FormioForm>;

type Story = StoryObj<typeof FormioForm>;

export const TextField: Story = {
  args: {
    components: [
      {
        key: 'textfield',
        type: 'textfield',
        label: 'Text field',
        validate: {
          required: true,
        },
      },
    ],
  },
};

export const EmailField: Story = {
  args: {
    components: [
      {
        key: 'email',
        type: 'email',
        label: 'Email field',
        validate: {
          required: true,
        },
      },
    ],
  },
};

export const DateField: Story = {
  args: {
    components: [
      {
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
    ],
  },
};

export const Radio: Story = {
  args: {
    components: [
      {
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
    ],
  },
};

export const Checkbox: Story = {
  args: {
    components: [
      {
        key: 'checkbox',
        type: 'checkbox',
        label: 'Checkbox',
        validate: {
          required: true,
        },
      },
    ],
  },
};
