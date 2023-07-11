import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import TextField from './TextField';

export default {
  title: 'Pure React Components / Forms / TextField',
  component: TextField,
  decorators: [FormikDecorator],
  parameters: {
    formik: {
      initialValues: {
        test: '',
      },
    },
  },
};

export const Default = {
  args: {
    name: 'test',
    id: 'test',
    label: 'test',
    description: 'This is a custom description',
    disabled: false,
    isRequired: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toBeVisible();
    await expect(canvas.getByText('test')).toBeVisible();
    await expect(canvas.getByText('This is a custom description')).toBeVisible();
    // Check if clicking on the label focuses the input
    const label = canvas.getByText('test');
    userEvent.click(label);
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

export const ValidationError = {
  name: 'Validation error',
  parameters: {
    formik: {
      initialValues: {
        textinput: 'some text',
      },
      initialErrors: {
        textinput: 'invalid',
      },
      initialTouched: {
        textinput: true,
      },
    },
  },
  args: {
    name: 'textinput',
    label: 'Text field',
    description: 'Description above the errors',
    disabled: false,
    isRequired: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('invalid')).toBeVisible();
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
