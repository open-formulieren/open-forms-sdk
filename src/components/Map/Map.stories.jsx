import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {useState} from 'react';

import {ConfigDecorator} from 'story-utils/decorators';

import LeafletMap from './index';
import {mockAddressSearchGet, mockLatLngSearchEmptyGet, mockLatLngSearchGet} from './mocks';

const withMapLayout = Story => (
  <div className="openforms-leaflet-map" style={{maxWidth: '600px'}}>
    <Story />
  </div>
);

const StorybookLeafletMap = props => {
  const [geoJson, setGeoJson] = useState(props?.geoJsonGeometry);
  const handleGeoJsonChange = args => {
    if (props?.onGeoJsonGeometrySet) {
      props?.onGeoJsonGeometrySet(args);
    }
    setGeoJson(args);
  };
  return (
    <LeafletMap {...props} geoJsonGeometry={geoJson} onGeoJsonGeometrySet={handleGeoJsonChange} />
  );
};

export default {
  title: 'Private API / Map',
  component: LeafletMap,
  decorators: [withMapLayout, ConfigDecorator],
  render: StorybookLeafletMap,
  args: {
    geoJsonGeometry: {
      type: 'Point',
      coordinates: [5.291266, 52.1326332],
    },
    defaultCenter: [52.1326332, 5.291266],
    defaultZoomLevel: 12,
    disabled: false,
  },
  parameters: {
    msw: {
      handlers: [mockAddressSearchGet, mockLatLngSearchGet],
    },
  },
};

export const Map = {};

export const MapWithAddressSearch = {
  args: {
    onGeoJsonGeometrySet: fn(),
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const button = await canvas.findByLabelText('Zoeken');
      await userEvent.click(button);
      expect(await canvas.findByPlaceholderText('Zoek adres')).toBeVisible();
    });

    const searchField = await canvas.findByPlaceholderText('Zoek adres');
    const searchBox = within(searchField.parentNode);
    await userEvent.type(searchField, 'Gemeente Utrecht');
    const searchResult = await searchBox.findByText('Utrecht, Utrecht, Utrecht');

    await userEvent.click(searchResult);
    await waitFor(async () => {
      // A marker is placed on the search result
      expect(args.onGeoJsonGeometrySet).toBeCalledWith({
        type: 'Point',
        // To make sure that this test doesn't magically fail, just expect any 2 values
        coordinates: [expect.anything(), expect.anything()],
      });
    });
  },
};

export const MapReverseGeoEmpty = {
  parameters: {
    msw: {
      handlers: [mockAddressSearchGet, mockLatLngSearchEmptyGet],
    },
  },
};

export const MapWithAerialPhotoBackground = {
  args: {
    tileLayerUrl:
      'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.png',
  },
};

export const MapWithInteractions = {
  args: {
    interactions: {
      polygon: true,
      polyline: true,
      marker: true,
    },
    onGeoJsonGeometrySet: fn(),
  },
  parameters: {
    msw: {
      handlers: [mockAddressSearchGet, mockLatLngSearchEmptyGet],
    },
  },
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const map = canvasElement.querySelector('.leaflet-pane.leaflet-map-pane');

    await step('All interactions are available', async () => {
      expect(await canvas.findByTitle('Pin/punt')).toBeVisible();
      expect(await canvas.findByTitle('Veelhoek (polygoon)')).toBeVisible();
      expect(await canvas.findByTitle('Lijn')).toBeVisible();
    });

    await step('Draw a marker', async () => {
      const markerButton = await canvas.findByTitle('Pin/punt');
      await userEvent.click(markerButton);

      await userEvent.click(map, {x: 100, y: 100});

      // This 'button' is the placed marker on the map
      expect(await canvas.findByRole('button', {name: 'Marker'})).toBeVisible();
      expect(args.onGeoJsonGeometrySet).toBeCalledWith({
        type: 'Point',
        // Expect that the coordinates array contains 2 items.
        // We cannot pin it to specific values, because they can differentiate.
        // To make sure that this test doesn't magically fail, just expect any 2 values
        coordinates: [expect.anything(), expect.anything()],
      });
    });
  },
};
