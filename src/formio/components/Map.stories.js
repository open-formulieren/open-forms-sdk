import {withUtrechtDocument} from 'story-utils/decorators';
import {ConfigDecorator} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / Map',
  decorators: [withUtrechtDocument, ConfigDecorator],
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
  },
};

export const Map = {
  render: SingleFormioComponent,
};
