import {mockAddressSearchGet, mockLatLngSearchGet} from 'components/Map/mocks';
import {ConfigDecorator} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / Map',
  decorators: [ConfigDecorator],
  args: {
    type: 'map',
    key: 'map',
    label: 'Kadaster map',
    extraComponentProperties: {
      initialCenter: {
        lat: undefined,
        lng: undefined,
      },
      defaultZoom: 13,
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
    extraComponentProperties: {
      description: `Any additional Form.io component properties, recursively merged into the
        component definition.`,
    },
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
    msw: {
      handlers: [mockAddressSearchGet, mockLatLngSearchGet],
    },
  },
};

export const Default = {
  name: 'Map',
  render: SingleFormioComponent,
};

export const MapWithOverlays = {
  render: SingleFormioComponent,
  args: {
    extraComponentProperties: {
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
      ],
    },
  },
};
