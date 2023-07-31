import {userEvent, within} from '@storybook/testing-library';

import {ConfigDecorator} from 'story-utils/decorators';

import LeafletMap from '.';
import {mockAddressSearchGet} from './mocks';

const withMapLayout = Story => (
  <div className="openforms-leaflet-map" style={{maxWidth: '600px'}}>
    <Story />
  </div>
);

export default {
  title: 'Private API / Map',
  component: LeafletMap,
  decorators: [withMapLayout, ConfigDecorator],
  args: {
    markerCoordinates: [52.1326332, 5.291266],
    defaultCenter: [52.1326332, 5.291266],
    defaultZoomLevel: 12,
    disabled: false,
  },
  parameters: {
    msw: {
      handlers: [mockAddressSearchGet],
    },
  },
};

export const Map = {};

export const MapWithAddressSearch = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByLabelText('Map component search button');
    await userEvent.click(button);

    const searchField = await canvas.findByPlaceholderText('Enter address, please');
    await userEvent.type(searchField, 'Gemeente Utrecht');
    const searchResult = await canvas.findByText('Utrecht, Utrecht, Utrecht');

    await userEvent.click(searchResult);
  },
};
