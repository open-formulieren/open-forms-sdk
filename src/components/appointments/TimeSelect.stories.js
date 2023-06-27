import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';
import {addDays, formatISO} from 'date-fns';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import TimeSelect from './TimeSelect';
import {mockAppointmentTimesGet} from './mocks';

const tomorrow = formatISO(addDays(new Date(), 1), {representation: 'date'});

export default {
  title: 'Private API / Appointments / Fields / TimeSelect',
  component: TimeSelect,
  decorators: [FormikDecorator, ConfigDecorator],
  parameters: {
    controls: {hideNoControlsWarning: true},
    formik: {
      initialValues: {
        products: [{productId: 'e8e045ab', amount: 1}],
        location: '1396f17c',
        date: tomorrow,
        datetime: '',
      },
    },
    msw: {
      handlers: [mockAppointmentTimesGet],
    },
  },
};

export const Default = {};

export const NoDateSelectedDisabled = {
  name: 'No date selected -> disabled',
  parameters: {
    formik: {
      initialValues: {
        products: [{productId: 'e8e045ab', amount: 1}],
        location: '1396f17c',
        date: '',
        datetime: '',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const dropdown = canvas.getByLabelText('Tijdstip');
    await expect(dropdown.role).toBe('combobox');
    await expect(dropdown).toBeDisabled();
  },
};

export const LocalizedTimes = {
  name: 'Times are localized',
  parameters: {
    chromatic: {disableSnapshot: true},
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const dropdown = canvas.getByLabelText('Tijdstip');
    await dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await waitFor(async () => {
      // see mocks.js for the returned times
      await expect(canvas.getByText('08:00')).toBeVisible();
      await expect(canvas.getByText('08:10')).toBeVisible();
      await expect(canvas.getByText('10:00')).toBeVisible();
      await expect(canvas.getByText('10:30')).toBeVisible();
      await expect(canvas.getByText('14:30')).toBeVisible();
    });
  },
};
