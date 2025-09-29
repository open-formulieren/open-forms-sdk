import {DateField} from '@open-formulieren/formio-renderer';
import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {addDays, subDays} from 'date-fns';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

export default {
  title: 'Pure React Components / Forms / DateField / Datepicker',
  component: DateField,
  decorators: [FormikDecorator],
  args: {
    widget: 'datePicker',
  },
  parameters: {
    formik: {
      initialValues: {
        test: '',
      },
    },
  },
} satisfies Meta<typeof DateField>;

type Story = StoryObj<typeof DateField>;

export const Datepicker: Story = {
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    isDisabled: false,
    isRequired: false,
    widgetProps: {
      minDate: undefined,
      maxDate: undefined,
    },
  },
};

export const LimitedRangeDatepicker: Story = {
  name: 'Limited range datepicker',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    expect(canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('A nearby date'));
    expect(await canvas.findByRole('dialog')).toBeVisible();
    // ESC key closes the dialog again
    await userEvent.keyboard('[Escape]');
    expect(canvas.queryByRole('dialog')).toBeNull();
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    isDisabled: false,
    isRequired: false,
    widgetProps: {
      minDate: subDays(new Date(), 3),
      maxDate: addDays(new Date(), 3),
    },
  },
};

export const DisabledDatesDatepicker: Story = {
  name: 'Datepicker with disabled dates',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    expect(canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('Today disabled'));
    expect(await canvas.findByRole('dialog')).toBeVisible();
    // today should be set to disabled
    const disabledEventButton = await canvas.findByRole('button', {name: 'zaterdag 20 mei 2023'});
    expect(disabledEventButton).toBeVisible();
    expect(disabledEventButton).toHaveClass('utrecht-button--disabled');
    expect(disabledEventButton).toBeDisabled();
  },
  parameters: {
    formik: {
      initialValues: {
        test: '2023-05-31',
      },
    },
  },
  args: {
    name: 'test',
    label: 'Today disabled',
    description: 'Yarp',
    isDisabled: false,
    isRequired: false,
    widgetProps: {
      disabledDates: ['2023-05-20', new Date().toISOString(), addDays(new Date(), 3).toISOString()],
    },
  },
};

export const DatepickerKeyboardNavigation: Story = {
  name: 'Datepicker - keyboard navigation',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    expect(canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('A nearby date'));
    expect(await canvas.findByRole('dialog')).toBeVisible();
    // ESC key closes the dialog again
    await userEvent.keyboard('[Escape]');
    expect(canvas.queryByRole('dialog')).toBeNull();
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    isDisabled: false,
    isRequired: false,
  },
};

export const DatepickerTypeDateManually: Story = {
  name: 'Datepicker - type date manually',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole('dialog')).toBeNull();
    const textInput = canvas.getByLabelText('A nearby date');
    await userEvent.type(textInput, '29-5-2023');
    textInput.blur();
    expect(canvas.queryByRole('dialog')).toBeNull();
    expect(textInput).toHaveDisplayValue('29-5-2023');
    // check that the date is properly highlighted
    await userEvent.click(textInput);
    expect(await canvas.findByRole('dialog')).toBeVisible();
    const selectedEventButton = await canvas.findByRole('button', {name: 'maandag 29 mei 2023'});
    expect(selectedEventButton).toBeVisible();
    expect(selectedEventButton).toHaveClass('utrecht-calendar__table-days-item-day--selected');
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    isDisabled: false,
    isRequired: false,
  },
  globals: {
    locale: 'nl',
  },
};

export const NoAsterisks: Story = {
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
