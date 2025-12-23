import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import {mockAppointmentDatesGet} from '@/api-mocks/appointments';
import {withFormik} from '@/sb-decorators';

import DateSelect from './DateSelect';

export default {
  title: 'Private API / Appointments / Fields / DateSelect',
  decorators: [withFormik],
  component: DateSelect,
  parameters: {
    formik: {
      initialValues: {
        location: '1396f17c',
        date: '',
      },
    },
    msw: {
      handlers: [mockAppointmentDatesGet],
    },
  },
  args: {
    products: [{productId: 'e8e045ab', amount: 1}],
  },
} satisfies Meta<typeof DateSelect>;

type Story = StoryObj<typeof DateSelect>;

export const AvailableDatesRange: Story = {
  name: 'Calendar with available date range',
};

export const DisabledGaps: Story = {
  name: 'Calendar with disabled gaps in date range',
  parameters: {
    formik: {
      initialValues: {
        location: '34000e85',
        date: '',
      },
    },
  },
};

export const NoLocationSelected: Story = {
  name: 'Calendar disabled when no location is set',
  parameters: {
    formik: {
      initialValues: {
        location: '',
        date: '',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText('Datum')).not.toBeDisabled();
    expect(canvas.getByLabelText('Datum')).toHaveAttribute('readonly');
    await userEvent.click(canvas.getByLabelText('Datum'));
    expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const NoDatesAvailable: Story = {
  name: 'No dates available',
  parameters: {
    formik: {
      initialValues: {
        location: 'no-date',
        date: '',
      },
    },
  },
};

export const SingleDateAvailable: Story = {
  name: 'Single date available',
  parameters: {
    formik: {
      initialValues: {
        location: 'single-date',
        date: '',
      },
    },
  },
};
