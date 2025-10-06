import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {addDays, formatISO} from 'date-fns';
import {withRouter} from 'storybook-addon-remix-react-router';

import {mockAppointmentCustomerFieldsGet} from '@/api-mocks/appointments';
import {withCard, withPageWrapper} from '@/sb-decorators';

import {withAppointmentState} from '../story-utils';
import type {AppointmentDataByStep, AppointmentErrors} from '../types';
import ContactDetailsStep from './ContactDetailsStep';

const TOMORROW: string = formatISO(addDays(new Date(), 1), {representation: 'date'});

export default {
  title: 'Private API / Appointments / Steps / 3 - Contact details',
  component: ContactDetailsStep,
  decorators: [withCard, withPageWrapper, withAppointmentState, withRouter],
  parameters: {
    controls: {hideNoControlsWarning: true},
    appointmentState: {
      currentStep: 'contactgegevens',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
        kalender: {
          location: '1396f17c',
          date: TOMORROW,
          datetime: `${TOMORROW}T08:00:00Z`,
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
    msw: {
      handlers: [mockAppointmentCustomerFieldsGet],
    },
  },
} satisfies Meta<typeof ContactDetailsStep>;

type Story = StoryObj<typeof ContactDetailsStep>;

export const InitialState: Story = {
  name: 'Initial state',
};

export const FillOutAllFields: Story = {
  name: 'Fill out all fields',
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Load fields from backend', async () => {
      await canvas.findByText('Last name');
    });

    await step('Fill out fields', async () => {
      await userEvent.type(canvas.getByLabelText('Last name'), 'Charlemagne');
      await userEvent.type(canvas.getByLabelText('Dag'), '2');
      await userEvent.type(canvas.getByLabelText('Maand'), '4');
      await userEvent.type(canvas.getByLabelText('Jaar'), '747');
      await userEvent.type(canvas.getByLabelText('Email'), 'emperor-chuck@rome.it');
      await userEvent.type(canvas.getByLabelText('Telephone'), '747-814');
      await userEvent.type(canvas.getByLabelText('BSN'), '3MP3R0R');
      await userEvent.click(canvas.getByLabelText('Male'));
    });

    await step('Check submit status', async () => {
      const submitButton = canvas.getByRole('button', {name: 'Naar overzicht'});
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  },
};

export const WithBackendErrors: Story = {
  name: 'Display backend errors',
  parameters: {
    appointmentState: {
      currentStep: 'contactgegevens',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
        kalender: {
          location: '1396f17c',
          date: TOMORROW,
          datetime: `${TOMORROW}T08:00:00Z`,
        },
        contactgegevens: {
          contactDetails: {
            lastName: 'Mr. Krabs',
          },
        },
      } satisfies Partial<AppointmentDataByStep>,
      appointmentErrors: {
        initialTouched: {contactDetails: {lastName: true}},
        initialErrors: {
          contactDetails: {lastName: 'Unfortunately, you are banned from making appointments.'},
        },
      } satisfies AppointmentErrors,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText('Unfortunately, you are banned from making appointments.')
    ).toBeVisible();
    const submitButton = canvas.getByRole('button', {name: 'Naar overzicht'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  },
};
