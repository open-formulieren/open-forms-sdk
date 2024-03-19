import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';
import {addDays, subDays} from 'date-fns';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import DateField from './DateField';

export default {
  title: 'Pure React Components / Forms / DateField / Datepicker',
  component: DateField,
  decorators: [FormikDecorator],
  args: {
    widget: 'datepicker',
    onChange: undefined,
  },
  argTypes: {
    showFormattedDate: {table: {disable: true}},
  },
  parameters: {
    formik: {
      initialValues: {
        test: '',
      },
    },
  },
};

export const Datepicker = {
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    disabled: false,
    isRequired: false,
    minDate: undefined,
    maxDate: undefined,
  },
};

export const LimitedRangeDatepicker = {
  name: 'Limited range datepicker',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('A nearby date'));
    await expect(await canvas.findByRole('dialog')).toBeVisible();
    // ESC key closes the dialog again
    await userEvent.keyboard('[Escape]');
    await expect(await canvas.queryByRole('dialog')).toBeNull();
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    disabled: false,
    isRequired: false,
    minDate: subDays(new Date(), 3),
    maxDate: addDays(new Date(), 3),
  },
};

export const DisabledDatesDatepicker = {
  name: 'Datepicker with disabled dates',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('Today disabled'));
    await expect(await canvas.findByRole('dialog')).toBeVisible();
    // today should be set to disabled
    const disabledEventButton = canvas.getByRole('button', {name: 'zaterdag 20 mei 2023'});
    await expect(disabledEventButton).toBeVisible();
    await expect(disabledEventButton).toHaveClass('utrecht-button--disabled');
    await expect(disabledEventButton).toBeDisabled();
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
    disabled: false,
    isRequired: false,
    disabledDates: ['2023-05-20', new Date().toISOString(), addDays(new Date(), 3).toISOString()],
  },
};

export const DatepickerKeyboardNavigation = {
  name: 'Datepicker - keyboard navigation',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // calendar is by default not visible, until you focus the field
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    await userEvent.click(canvas.getByText('A nearby date'));
    await expect(await canvas.findByRole('dialog')).toBeVisible();
    // ESC key closes the dialog again
    await userEvent.keyboard('[Escape]');
    await expect(await canvas.queryByRole('dialog')).toBeNull();
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    disabled: false,
    isRequired: false,
    minDate: undefined,
    maxDate: undefined,
  },
};

export const DatepickerTypeDateManually = {
  name: 'Datepicker - type date manually',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    const textInput = canvas.getByLabelText('A nearby date');
    await userEvent.type(textInput, '29/05/2023');
    await expect(await canvas.queryByRole('dialog')).toBeNull();
    await expect(textInput).toHaveDisplayValue('29-5-2023');
    // check that the date is properly highlighted
    await userEvent.click(textInput);
    await expect(await canvas.findByRole('dialog')).toBeVisible();
    const selectedEventButton = canvas.getByRole('button', {name: 'maandag 29 mei 2023'});
    await expect(selectedEventButton).toBeVisible();
    await expect(selectedEventButton).toHaveClass(
      'utrecht-calendar__table-days-item-day--selected'
    );
  },
  args: {
    name: 'test',
    label: 'A nearby date',
    description: 'Yarp',
    disabled: false,
    isRequired: false,
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
