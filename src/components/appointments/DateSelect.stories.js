import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import DateSelect from './DateSelect';
import {mockAppointmentDatesGet} from './mocks';

export default {
  title: 'Private API / Appointments / Fields / DateSelect',
  decorators: [FormikDecorator, ConfigDecorator],
  component: DateSelect,
  parameters: {
    formik: {
      initialValues: {
        products: [{productId: 'e8e045ab', amount: 1}],
        location: '1396f17c',
        date: '',
      },
    },
    msw: {
      handlers: [mockAppointmentDatesGet],
    },
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
        products: [{productId: 'e8e045ab', amount: 1}],
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
        products: [{productId: 'e8e045ab', amount: 1}],
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
        products: [{productId: 'e8e045ab', amount: 1}],
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
        products: [{productId: 'e8e045ab', amount: 1}],
        location: 'single-date',
        date: '',
      },
    },
  },
};
