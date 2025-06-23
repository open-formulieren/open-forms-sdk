import {FormioForm} from '@open-formulieren/formio-renderer';
import {DateComponentSchema} from '@open-formulieren/types';
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
        id: 'textfield',
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
        id: 'email',
        key: 'email',
        type: 'email',
        label: 'Email field',
        validate: {
          required: true,
        },
        validateOn: 'blur',
      },
    ],
  },
};

export const DateField: Story = {
  args: {
    components: [
      {
        id: 'date',
        key: 'date',
        type: 'date',
        label: 'Datefield',
        validate: {
          required: true,
        },
        openForms: {
          // @ts-expect-error - widget customization is not yet implemented
          widget: 'inputGroup',
        },
      } satisfies DateComponentSchema,
    ],
  },
};

export const Radio: Story = {
  args: {
    components: [
      {
        id: 'radio',
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
        defaultValue: null,
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
      },
    ],
  },
};

export const Checkbox: Story = {
  args: {
    components: [
      {
        id: 'checkbox',
        key: 'checkbox',
        type: 'checkbox',
        label: 'Checkbox',
        validate: {
          required: true,
        },
        defaultValue: false,
      },
    ],
  },
};
