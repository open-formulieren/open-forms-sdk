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
  const [geoJson, setGeoJson] = useState(props?.geoJsonFeature);
  const handleGeoJsonChange = args => {
    if (props?.onGeoJsonFeatureSet) {
      props?.onGeoJsonFeatureSet(args);
    }
    setGeoJson(args);
  };
  return (
    <LeafletMap {...props} geoJsonFeature={geoJson} onGeoJsonFeatureSet={handleGeoJsonChange} />
  );
};

export default {
  title: 'Private API / Map',
  component: LeafletMap,
  decorators: [withMapLayout, ConfigDecorator],
  render: StorybookLeafletMap,
  args: {
    geoJsonFeature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [5.291266, 52.1326332],
      },
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
    onGeoJsonFeatureSet: fn(),
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
      expect(args.onGeoJsonFeatureSet).toBeCalledWith({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // To make sure that this test doesn't magically fail, just expect any 2 values
          coordinates: [expect.anything(), expect.anything()],
        },
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
    onGeoJsonFeatureSet: fn(),
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
      expect(await canvas.findByTitle('Draw a marker')).toBeVisible();
      expect(await canvas.findByTitle('Draw a polygon')).toBeVisible();
      expect(await canvas.findByTitle('Draw a polyline')).toBeVisible();
    });

    await step('Draw a marker', async () => {
      const markerButton = await canvas.findByTitle('Draw a marker');
      await userEvent.click(markerButton);

      await userEvent.click(map, {x: 100, y: 100});

      expect(await canvas.findByRole('button', {name: 'Marker'})).toBeVisible();
      expect(args.onGeoJsonFeatureSet).toBeCalledWith({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          // Expect that the coordinates array contains 2 items.
          // We cannot pin it to specific values, because they can differentiate.
          // To make sure that this test doesn't magically fail, just expect any 2 values
          coordinates: [expect.anything(), expect.anything()],
        },
      });
    });
  },
};
