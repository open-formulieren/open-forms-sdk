import type {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';
import {addDays, formatISO} from 'date-fns';

import {mockAppointmentTimesGet} from 'api-mocks/appointments';

import {withFormik} from '@/sb-decorators';

import TimeSelect from './TimeSelect';

const tomorrow = formatISO(addDays(new Date(), 1), {representation: 'date'});

export default {
  title: 'Private API / Appointments / Fields / TimeSelect',
  component: TimeSelect,
  decorators: [withFormik],
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
} satisfies Meta<typeof TimeSelect>;

type Story = StoryObj<typeof TimeSelect>;

export const Default: Story = {};

export const NoDateSelectedDisabled: Story = {
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
    expect(dropdown.role).toBe('combobox');
    expect(dropdown).toBeDisabled();
  },
};

export const LocalizedTimes: Story = {
  name: 'Times are localized',
  parameters: {
    chromatic: {disableSnapshot: true},
  },
};
