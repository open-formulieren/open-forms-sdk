import type {Decorator, Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {LayoutDecorator, withCard} from 'story-utils/decorators';

import {mockAppointmentProductsGet} from '@/api-mocks/appointments';

import {AppointmentConfigContext} from '../Context';
import {withAppointmentState} from '../story-utils';
import type {AppointmentDataByStep, AppointmentErrors} from '../types';
import ChooseProductStep from './ChooseProductStep';

export default {
  title: 'Private API / Appointments / Steps / 1 - Choose product',
  component: ChooseProductStep,
  decorators: [withCard, LayoutDecorator, withAppointmentState, withRouter],
  parameters: {
    controls: {hideNoControlsWarning: true},
    msw: {
      handlers: [mockAppointmentProductsGet],
    },
    appointmentState: {
      currentStep: 'producten',
      appointmentData: {
        producten: {
          products: [
            {
              productId: '',
              amount: 1,
            },
          ],
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
  },
} satisfies Meta<typeof ChooseProductStep>;

type Story = StoryObj<typeof ChooseProductStep>;

export const InitialState: Story = {
  name: 'Initial state',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // we expect a single initial row
    const dropdowns = canvas.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(1);
    const amountInputs = canvas.getAllByLabelText('Aantal personen');
    expect(amountInputs).toHaveLength(1);

    // there should be a button to add a row
    expect(canvas.getByRole('button', {name: 'Nog een product toevoegen'})).toBeVisible();

    // and no button to remove the single row
    expect(canvas.queryByRole('button', {name: 'Verwijderen'})).toBeNull();
  },
};

export const AddingProducts: Story = {
  name: 'Adding products',
  parameters: {
    appointmentState: {
      currentStep: 'producten',
      appointmentData: {
        producten: {
          products: [
            {
              productId: '166a5c79',
              amount: 2,
            },
          ],
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const addButton = canvas.getByRole('button', {name: 'Nog een product toevoegen'});
    await userEvent.click(addButton);
    const dropdowns = canvas.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(2);
  },
};

export const RemovingProducts: Story = {
  name: 'Removing products',
  parameters: {
    appointmentState: {
      currentStep: 'producten',
      appointmentData: {
        producten: {
          products: [
            {
              productId: '166a5c79',
              amount: 2,
            },
            {
              productId: 'e8e045ab',
              amount: 1,
            },
          ],
        },
      } satisfies Partial<AppointmentDataByStep>,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const dropdowns = canvas.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(2);
    expect(await canvas.findByText('Paspoort aanvraag')).toBeVisible();
    expect(await canvas.findByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();

    // now any of both products can be removed
    const removeButtons = canvas.queryAllByRole('button', {name: 'Verwijderen'});
    expect(removeButtons).toHaveLength(2);

    // and after removing one row, the last remaining one can't be removed
    await userEvent.click(removeButtons[0]);
    expect(await canvas.findByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();
    expect(canvas.queryByText('Paspoort aanvraag')).toBeNull();
    expect(canvas.queryByRole('button', {name: 'Verwijderen'})).toBeNull();
  },
};

const withoutMultipleProducts: Decorator = Story => (
  <AppointmentConfigContext.Provider value={{supportsMultipleProducts: false}}>
    <Story />
  </AppointmentConfigContext.Provider>
);

export const NoMultipleProducts: Story = {
  name: 'No multiple products support',
  decorators: [withoutMultipleProducts],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    await canvas.findByRole('button', {name: 'Bevestig producten'});
  },
};

export const WithBackendErrors: Story = {
  name: 'Display backend errors',
  parameters: {
    appointmentState: {
      currentStep: 'producten',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
      } satisfies Partial<AppointmentDataByStep>,
      appointmentErrors: {
        initialTouched: {products: [{productId: true}]},
        initialErrors: {products: [{productId: 'Product is sold out.'}]},
      } satisfies AppointmentErrors,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Product is sold out.')).toBeVisible();
    const submitButton = canvas.getByRole('button', {name: 'Bevestig producten'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  },
};
