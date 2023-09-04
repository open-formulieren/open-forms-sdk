import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import {mockAppointmentDatesGet} from '../mocks';
import DateSelect from './DateSelect';

export default {
  title: 'Private API / Appointments / Fields / DateSelect',
  decorators: [FormikDecorator, ConfigDecorator],
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
};

export const AvailableDatesRange = {
  name: 'Calendar with available date range',
};

export const DisabledGaps = {
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

export const NoLocationSelected = {
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
    await expect(canvas.getByLabelText('Datum')).toBeDisabled();
    await userEvent.click(canvas.getByLabelText('Datum'));
    await expect(await canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const NoDatesAvailable = {
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

export const SingleDateAvailable = {
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
