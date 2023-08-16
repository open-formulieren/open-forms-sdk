import {expect} from '@storybook/jest';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import {ConfigDecorator, FormikDecorator} from 'story-utils/decorators';

import LocationSelect from './LocationSelect';
import {mockAppointmentLocationsGet} from './mocks';

export default {
  title: 'Private API / Appointments / Fields / LocationSelect',
  component: LocationSelect,
  decorators: [FormikDecorator, ConfigDecorator],
  parameters: {
    formik: {
      initialValues: {
        location: '',
      },
    },
    msw: {
      handlers: [mockAppointmentLocationsGet],
    },
  },
  args: {
    products: [{productId: 'e8e045ab', amount: 1}],
  },
};

export const MultipleCandidates = {
  name: 'Multiple candidate locations',
  play: async ({canvasElement}) => {
    // test that the options are fetched from the API endpoint
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Open Gem')).not.toBeInTheDocument();
    const dropdown = canvas.getByLabelText('Locatie');
    await userEvent.click(dropdown);
    await userEvent.keyboard('[ArrowDown]');
    await expect(await canvas.findByText('Open Gem')).toBeVisible();
    await expect(await canvas.findByText('Bahamas')).toBeVisible();
  },
};

export const SingleCandidate = {
  name: 'Single candidate location',
  args: {
    products: [
      {productId: 'e8e045ab', amount: 1},
      {productId: '166a5c79', amount: 1},
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Open Gem')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Bahamas')).not.toBeInTheDocument();

    const dropdown = canvas.getByLabelText('Locatie');
    await userEvent.click(dropdown);
    await userEvent.keyboard('[ArrowDown]');

    // wait for locations to be loaded
    await waitFor(async () => {
      const textNodes = canvas.queryAllByText('Open Gem');
      expect(textNodes.length).toBeGreaterThan(0);
    });

    await expect(canvas.queryByText('Bahamas')).not.toBeInTheDocument();
    await userEvent.keyboard('[Escape]');
    await expect(await canvas.findByText('Open Gem')).toBeVisible();
  },
};
