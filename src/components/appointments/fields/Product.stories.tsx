import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import {mockAppointmentProductsGet} from '@/api-mocks/appointments';
import type {AppointmentProduct} from '@/data/appointments';
import {withFormik} from '@/sb-decorators';

import {AppointmentConfigContext} from '../Context';
import Product from './Product';

const PRODUCTS_DATA: AppointmentProduct[] = [
  {
    productId: '166a5c79',
    amount: 2,
  },
  {
    productId: 'e8e045ab',
    amount: 1,
  },
];

interface Args {
  productId: string;
  selectedProductIds: string[];
  supportsMultipleProducts: boolean;
}

export default {
  title: 'Private API / Appointments / Product and amount',
  component: Product,
  decorators: [withFormik],
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
  args: {
    productId: '',
    selectedProductIds: [],
    supportsMultipleProducts: true,
  },
  argTypes: {
    productId: {
      options: ['166a5c79', 'e8e045ab'],
      control: {type: 'radio'},
    },
  },
  render: ({productId, selectedProductIds, supportsMultipleProducts = true}) => {
    const data_entry = PRODUCTS_DATA.find(prod => prod.productId === productId);
    const index = supportsMultipleProducts && data_entry ? PRODUCTS_DATA.indexOf(data_entry) : 0;
    return (
      <AppointmentConfigContext.Provider value={{supportsMultipleProducts}}>
        <Product namePrefix="products" index={index} selectedProductIds={selectedProductIds} />
      </AppointmentConfigContext.Provider>
    );
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const ProductAndAmount: Story = {
  name: 'Product and amount',
  args: {
    productId: '166a5c79',
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    // search for a product
    expect(await canvas.findByText('Paspoort aanvraag')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Product'), 'Rijbewijs');
    await userEvent.click(await canvas.findByText('Rijbewijs aanvraag (Drivers license)'));
    expect(canvas.queryByText('Paspoort aanvraag')).toBeNull();
    expect(await canvas.findByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();
    const amountInput = canvas.getByLabelText('Aantal personen');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1');
    expect(amountInput).toHaveDisplayValue('1');
  },
};

export const NoMultipleProductsSupport: Story = {
  name: 'No multiple products support',
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
