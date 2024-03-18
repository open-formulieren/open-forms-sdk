import {expect} from '@storybook/test';
import {userEvent, within} from '@storybook/test';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import {mockAppointmentProductsGet} from '../mocks';
import {default as ProductSelectComponent} from './ProductSelect';

export default {
  title: 'Private API / Appointments / Fields / ProductSelect',
  component: ProductSelectComponent,
  decorators: [FormikDecorator, ConfigDecorator],
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
};

export const ProductSelect = {
  name: 'Data from API endpoint',
  play: async ({canvasElement}) => {
    // test that the options are fetched from the API endpoint
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Paspoort aanvraag')).toBeNull();
    const dropdown = canvas.getByLabelText('Product');
    await dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    await expect(await canvas.findByText('Paspoort aanvraag')).toBeVisible();
  },
};
