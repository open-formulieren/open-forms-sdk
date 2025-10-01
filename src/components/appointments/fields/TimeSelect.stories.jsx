import {expect, within} from '@storybook/test';
import {addDays, formatISO} from 'date-fns';

import {mockAppointmentTimesGet} from 'api-mocks/appointments';
import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import TimeSelect from './TimeSelect';

const tomorrow = formatISO(addDays(new Date(), 1), {representation: 'date'});

export default {
  title: 'Private API / Appointments / Fields / TimeSelect',
  component: TimeSelect,
  decorators: [FormikDecorator, ConfigDecorator],
  parameters: {
    controls: {hideNoControlsWarning: true},
    formik: {
      initialValues: {
        location: '1396f17c',
        date: tomorrow,
        datetime: '',
      },
    },
    msw: {
      handlers: [mockAppointmentTimesGet],
    },
  },
  args: {
    products: [{productId: 'e8e045ab', amount: 1}],
  },
};

export const Default = {};

export const NoDateSelectedDisabled = {
  name: 'No date selected -> disabled',
  parameters: {
    formik: {
      initialValues: {
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
};
