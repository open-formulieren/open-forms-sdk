import type {Meta, StoryObj} from '@storybook/react-vite';
import {formatISO} from 'date-fns';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, userEvent, within} from 'storybook/test';

import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '@/api-mocks/appointments';
import {withCard, withPageWrapper} from '@/sb-decorators';

import {withAppointmentState} from '../story-utils';
import type {AppointmentDataByStep, AppointmentErrors} from '../types';
import LocationAndTimeStep from './LocationAndTimeStep';

export default {
  title: 'Private API / Appointments / Steps / 2 - Location and time',
  component: LocationAndTimeStep,
  decorators: [withCard, withPageWrapper, withAppointmentState, withRouter],
  parameters: {
    controls: {hideNoControlsWarning: true},
    appointmentState: {
      currentStep: 'kalender',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
        kalender: {
          location: '',
          date: '',
          datetime: '',
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
    msw: {
      handlers: [
        mockAppointmentProductsGet,
        mockAppointmentLocationsGet,
        mockAppointmentDatesGet,
        mockAppointmentTimesGet,
      ],
    },
  },
} satisfies Meta<typeof LocationAndTimeStep>;

type Story = StoryObj<typeof LocationAndTimeStep>;

export const InitialState: Story = {
  name: 'Initial state',
};

export const WithBackendErrors: Story = {
  name: 'Display backend errors',
  parameters: {
    appointmentState: {
      currentStep: 'kalender',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
        kalender: {
          location: '1396f17c',
          date: '2023-07-12',
          datetime: '',
        },
      } satisfies Partial<AppointmentDataByStep>,
      appointmentErrors: {
        initialTouched: {date: true},
        initialErrors: {date: 'This date is not available'},
      } satisfies AppointmentErrors,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('This date is not available')).toBeVisible();
    const submitButton = canvas.getByRole('button', {name: 'Naar contactgegevens'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  },
};

const TODAY = formatISO(new Date(), {representation: 'date'});

export const DependentFieldsReset: Story = {
  name: 'Dependent fields reset',
  parameters: {
    appointmentState: {
      currentStep: 'kalender',
      appointmentData: {
        producten: {
          products: [{productId: 'e8e045ab', amount: 1}],
        },
        kalender: {
          location: '34000e85',
          date: TODAY,
          datetime: '',
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('Tijdstip')).not.toBeDisabled();
    expect(canvas.getByLabelText('Tijdstip')).not.toHaveAttribute('aria-readonly');

    await step('Change location', async () => {
      const dropdown = canvas.getByLabelText('Locatie');
      await userEvent.click(dropdown);
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('Open Gem (Amsterdam)'));
    });

    expect(canvas.getByLabelText('Datum')).toHaveDisplayValue('');
    expect(canvas.getByLabelText('Tijdstip')).not.toBeDisabled();
    expect(canvas.getByLabelText('Tijdstip')).toHaveAttribute('aria-readonly', 'true');
  },
};
