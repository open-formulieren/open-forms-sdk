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
    const map = await canvas.findByTestId('leaflet-map');

    await waitFor(() => {
      expect(map).not.toBeNull();
      expect(map).toBeVisible();
    });

    await step('All interactions are available', async () => {
      const pin = await canvas.findByTitle('Pin/punt');
      await waitFor(() => expect(pin).toBeVisible());

      const polygon = await canvas.findByTitle('Veelhoek (polygoon)');
      await waitFor(() => expect(polygon).toBeVisible());

      const line = await canvas.findByTitle('Lijn');
      await waitFor(() => expect(line).toBeVisible());
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

export const MapWithOverlays = {
  args: {
    // Center on a more populated area, to better showcase the WMS layers
    geoJsonGeometry: {
      type: 'Point',
      coordinates: [5.284580856043387, 52.120930596779296],
    },
    overlays: [
      {
        uuid: 'f20448c3-a8cb-471c-bfcc-78a6c22d0ae6',
        url: 'https://service.pdok.nl/bzk/bro-grondwaterspiegeldiepte/wms/v2_0?request=getCapabilities&service=WMS',
        label: 'Grondwaterspiegeldiepte layer',
        type: 'wms',
        layers: ['bro-grondwaterspiegeldieptemetingen-GHG'],
      },
      {
        uuid: '931f18f0-cedc-453b-a2d5-a2c1ff9df523',
        url: 'https://service.pdok.nl/lv/bag/wms/v2_0?request=getCapabilities&service=WMS',
        label: 'BAG Pand and Verblijfsobject layer',
        type: 'wms',
        layers: ['pand', 'verblijfsobject'],
      },
      {
        uuid: '4a76c09a-2ae3-4c17-8b40-ade45cb86a0e',
        url: 'https://service.pdok.nl/lv/bag/wfs/v2_0?request=getCapabilities&service=WFS',
        label: 'Unsupported WFS layer',
        type: 'wfs',
        layers: ['pand'],
      },
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const map = await canvas.findByTestId('leaflet-map');

    await waitFor(() => {
      expect(map).not.toBeNull();
      expect(map).toBeVisible();
    });

    await step('Layers menu is shown with the defined and supported layers', async () => {
      const layersButton = canvas.getByRole('button', {name: 'Layers'});
      await userEvent.hover(layersButton);

      const layerCheckbox1 = canvas.getByLabelText('BAG Pand and Verblijfsobject layer');
      const layerCheckbox2 = canvas.getByLabelText('Grondwaterspiegeldiepte layer');

      // Expect both layers to be visible and checked
      expect(layerCheckbox1).toBeVisible();
      expect(layerCheckbox2).toBeVisible();
      expect(layerCheckbox1).toBeChecked();
      expect(layerCheckbox2).toBeChecked();

      // At this time, WFS layers are not yet supported. So this layer should not be
      // displayed in the Layers menu.
      const wfsLayerCheckbox = canvas.queryByLabelText('Unsupported WFS layer');

      expect(wfsLayerCheckbox).not.toBeInTheDocument();
    });
  },
};

export const MapWithOneInteraction = {
  args: {
    interactions: {
      polygon: false,
      polyline: false,
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
    const map = await canvas.findByTestId('leaflet-map');

    await waitFor(() => {
      expect(map).not.toBeNull();
      expect(map).toBeVisible();
    });

    await step('None of the interactions are shown', async () => {
      const pin = canvas.queryByTitle('Pin/punt');
      const polygon = canvas.queryByTitle('Veelhoek (polygoon)');
      const line = canvas.queryByTitle('Lijn');

      expect(pin).not.toBeInTheDocument();
      expect(polygon).not.toBeInTheDocument();
      expect(line).not.toBeInTheDocument();
    });

    await step('Draw a marker', async () => {
      // Because there is only one shape, we can draw without having to click the
      // "draw marker" button.
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

export const MapDeleteMarker = {
  args: {
    // Center on a more populated area, to better showcase the WMS layers
    geoJsonGeometry: {
      type: 'Point',
      coordinates: [5.284580856043387, 52.120930596779296],
    },
    interactions: {
      polygon: true,
      polyline: true,
      marker: true,
    },
    onGeoJsonGeometrySet: fn(),
  },
  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const map = await canvas.findByTestId('leaflet-map');

    await waitFor(() => {
      expect(map).not.toBeNull();
      expect(map).toBeVisible();
    });

    // Sanity check, the `args.geoJsonGeometry` is shown in the map component.
    expect(await within(map).findByRole('button', {name: 'Marker'})).toBeVisible();

    // The delete button is shown in the map, and is enabled.
    const deleteButton = await within(map).findByRole('link', {name: 'Verwijder vormen'});
    expect(deleteButton).toBeVisible();
    expect(deleteButton).toBeEnabled();

    await step('delete marker', async () => {
      // Automatically resolve the confirmation message
      window.confirm = () => true;
      await userEvent.click(deleteButton);

      // The value "null" is used to clear the map user data.
      expect(args.onGeoJsonGeometrySet).toHaveBeenCalledWith(null);
    });

    await step('Check that no marker is visible and delete button is disabled', async () => {
      // Expect marker to no-longer be visible.
      await waitFor(async () => {
        const marker = await within(map).queryByRole('button', {name: 'Marker'});
        expect(marker).toBeNull();
      });

      expect(deleteButton).toHaveAttribute('title', 'Geen vormen om te verwijderen');
      expect(deleteButton).toHaveClass('leaflet-disabled');
    });
  },
};
