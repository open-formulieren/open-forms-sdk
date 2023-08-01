import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Number',
  decorators: [withUtrechtDocument],
  args: {
    type: 'number',
    extraComponentProperties: {},
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

export const Number = {
  render: SingleFormioComponent,
  args: {
    key: 'number',
    label: 'Aantal',
  },
};

export const NumberWithSuffix = {
  render: SingleFormioComponent,
  args: {
    key: 'number',
    label: 'Aantal',
    extraComponentProperties: {
      suffix: 'm<sup>3</sup>',
    },
  },
};
