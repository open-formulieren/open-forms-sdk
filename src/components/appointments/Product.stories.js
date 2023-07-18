import {expect} from '@storybook/jest';
import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import Product from './Product';
import {mockAppointmentProductsGet} from './mocks';

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
};

const render = ({productId}) => {
  const data_entry = PRODUCTS_DATA.find(prod => prod.productId === productId);
  const index = PRODUCTS_DATA.indexOf(data_entry);
  return <Product namePrefix="products" index={index} />;
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
