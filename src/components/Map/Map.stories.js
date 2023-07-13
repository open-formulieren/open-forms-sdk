import LeafletMap from '.';

const withMapLayout = Story => (
  <div className="openforms-leaflet-map" style={{maxWidth: '600px'}}>
    <Story />
  </div>
);

export default {
  title: 'Private API / Map',
  component: LeafletMap,
  decorators: [withMapLayout],
  args: {
    markerCoordinates: [52.1326332, 5.291266],
    defaultCenter: [52.1326332, 5.291266],
    defaultZoomLevel: 12,
    disabled: true, // TODO: ideally this would be false but firefox has an infinite loop with onMarkerSet.
  },
  parameters: {
    chromatic: {disableSnapshot: true},
  },
};

export const Map = {
  args: {
    component: {
      lat: 52.1326332,
      lng: 5.291266,
      defaultZoom: 12,
    },
  },
};
