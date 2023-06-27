import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Textarea',
  decorators: [withUtrechtDocument],
  args: {
    type: 'textarea',
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

export const Textarea = {
  render: SingleFormioComponent,
  args: {
    key: 'textarea',
    label: 'Uw bericht',
  },
};
