import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import RadioField from './RadioField';

export default {
  title: 'Pure React Components / Forms / RadioField',
  component: RadioField,
  decorators: [FormikDecorator],
  args: {
    options: [
      {value: 'sehen', label: 'Sehen'},
      {value: 'reden', label: 'Reden'},
      {value: 'horen', label: 'Hören'},
    ],
  },
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
    label: 'Radio field',
    description: 'This is a custom description',
    disabled: false,
    isRequired: true,
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(3);
    await expect(canvas.getByText('Sehen')).toBeVisible();
    await expect(canvas.getByText('This is a custom description')).toBeVisible();

    await step('Select value', async () => {
      await userEvent.click(canvas.getByText('Reden'));
      await expect(radios[1]).toBeChecked();
    });
  },
};

export const ValidationError = {
  name: 'Validation error',
  parameters: {
    formik: {
      initialValues: {
        radioInput: 'some text',
      },
      initialErrors: {
        radioInput: 'invalid',
      },
    },
  },
  args: {
    name: 'radioInput',
    label: 'Radio',
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
