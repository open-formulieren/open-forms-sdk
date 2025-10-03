import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, waitFor, within} from '@storybook/test';

import {mockAppointmentLocationsGet} from 'api-mocks/appointments';

import {withFormik} from '@/sb-decorators';

import LocationSelect from './LocationSelect';

export default {
  title: 'Private API / Appointments / Fields / LocationSelect',
  component: LocationSelect,
  decorators: [withFormik],
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
} satisfies Meta<typeof LocationSelect>;

type Story = StoryObj<typeof LocationSelect>;

export const MultipleCandidates: Story = {
  name: 'Multiple candidate locations',
  play: async ({canvasElement}) => {
    // test that the options are fetched from the API endpoint
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Open Gem')).not.toBeInTheDocument();
    const dropdown = canvas.getByLabelText('Locatie');
    dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');
    expect(await canvas.findByRole('option', {name: 'Open Gem'})).toBeVisible();
    expect(await canvas.findByRole('option', {name: 'Bahamas'})).toBeVisible();
  },
};

export const SingleCandidate: Story = {
  name: 'Single candidate location',
  args: {
    products: [
      {productId: 'e8e045ab', amount: 1},
      {productId: '166a5c79', amount: 1},
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Open Gem')).not.toBeInTheDocument();
    expect(canvas.queryByText('Bahamas')).not.toBeInTheDocument();

    const dropdown = canvas.getByLabelText('Locatie');
    dropdown.focus();
    await userEvent.keyboard('[ArrowDown]');

    // wait for locations to be loaded
    await waitFor(async () => {
      const textNodes = canvas.queryAllByText('Open Gem');
      expect(textNodes.length).toBeGreaterThan(0);
    });

    expect(canvas.queryByText('Bahamas')).not.toBeInTheDocument();
    await userEvent.keyboard('[Escape]');
    expect(await canvas.findByText('Open Gem')).toBeVisible();
  },
};
