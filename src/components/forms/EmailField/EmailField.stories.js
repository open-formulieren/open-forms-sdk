import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import EmailField from './EmailField';

export default {
  title: 'Pure React Components / Forms / EmailField',
  decorators: [FormikDecorator],
  component: EmailField,
  parameters: {
    formik: {
      initialValues: {
        email: 'test',
      },
    },
  },
};

export const Default = {
  args: {
    name: 'email',
    id: 'email',
    label: 'Email',
    description: 'This is a custom description for the email field',
    disabled: false,
    isRequired: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');
    await expect(input).toBeVisible();
    await expect(canvas.getByRole('textbox')).toBe(input);
    await expect(input.type).toBe('email');
    await expect(
      canvas.getByText('This is a custom description for the email field')
    ).toBeVisible();
    // Check if clicking on the label focuses the input
    const label = canvas.getByText('Email');
    userEvent.click(label);
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

export const ValidationError = {
  name: 'Validation error',
  parameters: {
    formik: {
      initialValues: {
        email: 'test',
      },
      initialErrors: {
        email: 'invalid_email',
      },
      initialTouched: {
        email: true,
      },
    },
  },
  args: {
    name: 'email',
    id: 'email',
    label: 'Email',
    description: 'Description above the errors',
    disabled: false,
    isRequired: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('invalid_email')).toBeVisible();
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
    name: 'email',
    label: 'Default required',
    isRequired: true,
  },
};
