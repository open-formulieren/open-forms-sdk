import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import {mockAppointmentProductsGet} from '@/api-mocks/appointments';
import {withFormik} from '@/sb-decorators';

import {default as ProductSelectComponent} from './ProductSelect';

export default {
  title: 'Private API / Appointments / Fields / ProductSelect',
  component: ProductSelectComponent,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    formik: {
      initialValues: {
        productId: '',
      },
    },
    msw: {
      handlers: [mockAppointmentProductsGet],
    },
  },
  args: {
    name: 'productId',
    selectedProductIds: [],
  },
  argTypes: {
    name: {table: {disable: true}},
  },
} satisfies Meta<typeof ProductSelectComponent>;

type Story = StoryObj<typeof ProductSelectComponent>;

export const ProductSelect: Story = {
  name: 'Data from API endpoint',
  play: async ({canvasElement}) => {
    // test that the options are fetched from the API endpoint
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Paspoort aanvraag')).toBeNull();
    const dropdown = canvas.getByLabelText('Product');
    dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    expect(await canvas.findByText('Paspoort aanvraag')).toBeVisible();
  },
};

export const ProductSelectExtraDescription: Story = {
  name: 'Product with description',
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const dropdown = canvas.getByLabelText('Product');
    dropdown.focus();

    await userEvent.click(dropdown);
    await userEvent.keyboard('[ArrowDown]');

    const passportOption = await canvas.findByRole('option', {name: 'Paspoort aanvraag'});
    expect(passportOption).toBeVisible();
    await userEvent.click(passportOption);

    expect(canvas.queryByText('An example of extra description')).toBeInTheDocument();
  },
};
