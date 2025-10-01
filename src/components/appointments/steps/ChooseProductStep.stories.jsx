import {expect, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {mockAppointmentProductsGet} from 'api-mocks/appointments';
import {ConfigDecorator, LayoutDecorator, withCard} from 'story-utils/decorators';

import {AppointmentConfigContext} from '../Context';
import {withAppointmentState} from '../story-utils';
import ChooseProductStep from './ChooseProductStep';

export default {
  title: 'Private API / Appointments / Steps / 1 - Choose product',
  component: ChooseProductStep,
  decorators: [withCard, LayoutDecorator, withAppointmentState, withRouter, ConfigDecorator],
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
      },
    },
  },
};

export const InitialState = {
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

export const AddingProducts = {
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
      },
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

export const RemovingProducts = {
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
      },
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

const withoutMultipleProducts = Story => (
  <AppointmentConfigContext.Provider value={{supportsMultipleProducts: false}}>
    <Story />
  </AppointmentConfigContext.Provider>
);

export const NoMultipleProducts = {
  name: 'No multiple products support',
  decorators: [withoutMultipleProducts],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    await canvas.findByRole('button', {name: 'Bevestig producten'});
  },
};

export const WithBackendErrors = {
  name: 'Display backend errors',
  parameters: {
    appointmentState: {
      currentStep: 'producten',
      appointmentData: {
        producten: {
          products: [{productId: '166a5c79', amount: 1}],
        },
      },
      appointmentErrors: {
        initialTouched: {products: [{productId: true}]},
        initialErrors: {products: [{productId: 'Product is sold out.'}]},
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Product is sold out.')).toBeVisible();
    const submitButton = canvas.getByRole('button', {name: 'Bevestig producten'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  },
};
