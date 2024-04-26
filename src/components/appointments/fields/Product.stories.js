import {expect, userEvent, within} from '@storybook/test';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import {AppointmentConfigContext} from '../Context';
import {mockAppointmentProductsGet} from '../mocks';
import Product from './Product';

const PRODUCTS_DATA = [
  {
    productId: '166a5c79',
    amount: 2,
  },
  {
    productId: 'e8e045ab',
    amount: 1,
  },
];

export default {
  title: 'Private API / Appointments / Product and amount',
  component: Product,
  decorators: [FormikDecorator, ConfigDecorator],
  parameters: {
    formik: {
      initialValues: {
        products: PRODUCTS_DATA,
      },
    },
    msw: {
      handlers: [mockAppointmentProductsGet],
    },
  },
  argTypes: {
    productId: {
      options: ['166a5c79', 'e8e045ab'],
      control: {type: 'radio'},
    },
    namePrefix: {table: {disable: true}},
    index: {table: {disable: true}},
  },
  args: {
    selectedProductIds: [],
    supportsMultipleProducts: true,
  },
};

const render = ({productId, selectedProductIds, supportsMultipleProducts = true}) => {
  const data_entry = PRODUCTS_DATA.find(prod => prod.productId === productId);
  const index = supportsMultipleProducts ? PRODUCTS_DATA.indexOf(data_entry) : 0;
  return (
    <AppointmentConfigContext.Provider value={{supportsMultipleProducts}}>
      <Product namePrefix="products" index={index} selectedProductIds={selectedProductIds} />
    </AppointmentConfigContext.Provider>
  );
};

export const ProductAndAmount = {
  name: 'Product and amount',
  render,
  args: {
    productId: '166a5c79',
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // search for a product
    await expect(await canvas.findByText('Paspoort aanvraag')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Product'), 'Rijbewijs');
    await userEvent.click(await canvas.findByText('Rijbewijs aanvraag (Drivers license)'));
    await expect(canvas.queryByText('Paspoort aanvraag')).toBeNull();
    await expect(await canvas.findByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();
    const amountInput = canvas.getByLabelText('Aantal personen');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1');
    await expect(amountInput).toHaveDisplayValue('1');
  },
};

export const NoMultipleProductsSupport = {
  name: 'No multiple products support',
  render,
  parameters: {
    formik: {
      initialValues: {
        products: [
          {
            productId: '166a5c79',
            amount: 1,
          },
        ],
      },
    },
  },
  args: {
    supportsMultipleProducts: false,
  },
  argTypes: {
    productId: {table: {disable: true}},
    selectedProductIds: {table: {disable: true}},
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const amountInput = canvas.getByLabelText('Aantal personen');
    expect(amountInput).toHaveDisplayValue('1');
    // typing does not have any effect
    await userEvent.type(amountInput, '0');
    expect(amountInput).toHaveDisplayValue('1');
    expect(amountInput).toHaveAttribute('readonly', '');
  },
};
