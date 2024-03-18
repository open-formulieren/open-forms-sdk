import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';
import {formatISO} from 'date-fns';
import {withRouter} from 'storybook-addon-react-router-v6';

import {ConfigDecorator, LayoutDecorator, withCard} from 'story-utils/decorators';

import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '../mocks';
import {withAppointmentState} from '../story-utils';
import LocationAndTimeStep from './LocationAndTimeStep';

export default {
  title: 'Private API / Appointments / Steps / 2 - Location and time',
  component: LocationAndTimeStep,
  decorators: [withCard, LayoutDecorator, withAppointmentState, withRouter, ConfigDecorator],
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
      },
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
};

export const InitialState = {
  name: 'Initial state',
};

export const WithBackendErrors = {
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
      },
      appointmentErrors: {
        initialTouched: {date: true},
        initialErrors: {date: 'This date is not available'},
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText('This date is not available')).toBeVisible();
    const submitButton = canvas.getByRole('button', {name: 'Naar contactgegevens'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  },
};

const TODAY = formatISO(new Date(), {representation: 'date'});

export const DependentFieldsReset = {
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
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('Tijdstip')).not.toBeDisabled();

    await step('Change location', async () => {
      const dropdown = canvas.getByLabelText('Locatie');
      await userEvent.click(dropdown);
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('Open Gem'));
    });

    expect(canvas.getByLabelText('Datum')).toHaveDisplayValue('');
    expect(canvas.getByLabelText('Tijdstip')).toBeDisabled();
  },
};
