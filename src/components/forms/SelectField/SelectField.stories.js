import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';
import {useCallback} from 'react';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import AsyncSelectField from './AsyncSelectField';
import SelectField from './SelectField';

export default {
  title: 'Pure React Components / Forms / SelectField',
  component: SelectField,
  decorators: [FormikDecorator],
  parameters: {
    formik: {
      initialValues: {
        select: 'option-1',
      },
    },
  },
};

export const Static = {
  args: {
    name: 'select',
    id: 'select-static',
    label: 'Static options',
    description: 'This is a custom description for the select field',
    disabled: false,
    isRequired: true,
    options: [
      {value: 'option-1', label: 'Option 1'},
      {value: 'option-2', label: 'Option 2'},
    ],
  },
  parameters: {
    formik: {
      initialValues: {
        select: '',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const dropdown = canvas.getByLabelText('Static options');
    await expect(dropdown).toBeVisible();
    await expect(
      canvas.getByText('This is a custom description for the select field')
    ).toBeVisible();
    await expect(dropdown.role).toBe('combobox');

    // test that a value can be selected
    await expect(canvas.queryByText('Option 1')).toBeNull();
    await dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await expect(canvas.getByText('Option 1')).toBeVisible();
    await expect(canvas.getByText('Option 2')).toBeVisible();
    await userEvent.click(canvas.getByText('Option 2'));
    await expect(canvas.getByText('Option 2')).toBeVisible();
    await expect(canvas.queryByText('Option 1')).toBeNull();
  },
};

export const MenuOpen = {
  name: 'Force menu open',
  args: {
    name: 'select',
    id: 'select-static',
    label: 'Static options',
    description: 'This is a custom description for the select field',
    disabled: false,
    isRequired: true,
    options: [
      {value: 'option-1', label: 'Option 1'},
      {value: 'option-2', label: 'Option 2'},
    ],
    menuIsOpen: true,
  },
  parameters: {
    formik: {
      initialValues: {
        select: '',
      },
    },
  },
};

const delay = async delay => await new Promise(resolve => setTimeout(resolve, delay));

export const Async = {
  name: 'Async',
  render: ({getOptionsDelay, dynamicOptions, ...args}) => {
    const getOptions = useCallback(async () => {
      await delay(getOptionsDelay);
      return dynamicOptions;
    }, [JSON.stringify(dynamicOptions), getOptionsDelay]);
    return <AsyncSelectField {...args} getOptions={getOptions} />;
  },
  args: {
    name: 'select',
    id: 'select-dynamic',
    label: 'Dynamic options',
    description: 'This is a custom description for the select field',
    disabled: false,
    isRequired: true,
    getOptionsDelay: 1000,
    dynamicOptions: [
      {value: 'daffy', label: 'Daffy'},
      {value: 'bugs', label: 'Bugs'},
      {value: 'elmer', label: 'Elmer'},
    ],
  },
  argTypes: {
    options: {table: {disable: true}},
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    const dropdown = canvas.getByLabelText('Dynamic options');
    await expect(dropdown).toBeVisible();
    await expect(
      canvas.getByText('This is a custom description for the select field')
    ).toBeVisible();
    await expect(dropdown.role).toBe('combobox');

    // initially, in the loading state the options should not be visible
    await dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await expect(canvas.queryByText('Daffy')).toBeNull();
    await expect(canvas.queryByText('Bugs')).toBeNull();
    await expect(canvas.queryByText('Elmer')).toBeNull();
    await delay(args.getOptionsDelay + 5); // wait to resolve
    await expect(canvas.getByText('Daffy')).toBeVisible();
  },
};

export const ValidationError = {
  name: 'Validation error',
  parameters: {
    formik: {
      initialValues: {
        invalidSelect: '',
      },
      initialErrors: {
        invalidSelect: 'invalid',
      },
    },
  },
  args: {
    name: 'invalidSelect',
    label: 'Invalid select',
    description: 'Description above the errors',
    disabled: false,
    isRequired: false,
    options: [
      {value: 'option-1', label: 'Option 1'},
      {value: 'option-2', label: 'Option 2'},
    ],
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
    name: 'select',
    id: 'select',
    label: 'Default required',
    disabled: false,
    isRequired: true,
    options: [
      {value: 'option-1', label: 'Option 1'},
      {value: 'option-2', label: 'Option 2'},
    ],
  },
};
