import {SelectField} from '@open-formulieren/formio-renderer';
import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {useCallback} from 'react';

import {FormikDecorator} from 'story-utils/decorators';

import {sleep} from '@/utils';

import AsyncSelectField from './AsyncSelectField';

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
} satisfies Meta<typeof SelectField>;

type Story = StoryObj<typeof SelectField>;

export const Static: Story = {
  args: {
    name: 'select',
    label: 'Static options',
    description: 'This is a custom description for the select field',
    isDisabled: false,
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
    dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await expect(canvas.getByText('Option 1')).toBeVisible();
    await expect(canvas.getByText('Option 2')).toBeVisible();
    await userEvent.click(canvas.getByText('Option 2'));
    await expect(canvas.getByText('Option 2')).toBeVisible();
    await expect(canvas.queryByText('Option 1')).toBeNull();
  },
};

interface AsyncSelectFieldArgs extends React.ComponentProps<typeof AsyncSelectField> {
  getOptionsDelay: number;
  dynamicOptions: {value: string; label: string}[];
}

export const Async: StoryObj<AsyncSelectFieldArgs> = {
  render: function Render({getOptionsDelay, dynamicOptions, ...args}) {
    const serializedOptions = JSON.stringify(dynamicOptions);
    const getOptions = useCallback(async () => {
      await sleep(getOptionsDelay);
      return JSON.parse(serializedOptions);
    }, [serializedOptions, getOptionsDelay]);
    return <AsyncSelectField {...args} getOptions={getOptions} />;
  },
  args: {
    name: 'select',
    label: 'Dynamic options',
    description: 'This is a custom description for the select field',
    isDisabled: false,
    isRequired: true,
    getOptionsDelay: 1000,
    dynamicOptions: [
      {value: 'daffy', label: 'Daffy'},
      {value: 'bugs', label: 'Bugs'},
      {value: 'elmer', label: 'Elmer'},
    ],
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
    dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await expect(canvas.queryByText('Daffy')).toBeNull();
    await expect(canvas.queryByText('Bugs')).toBeNull();
    await expect(canvas.queryByText('Elmer')).toBeNull();
    await sleep(args.getOptionsDelay + 5); // wait to resolve
    await expect(canvas.getByText('Daffy')).toBeVisible();
  },
};
