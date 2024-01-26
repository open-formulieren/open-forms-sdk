import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / Cosign',
  decorators: [withUtrechtDocument],
  args: {
    key: 'cosign',
    type: 'cosign',
    label: 'Co-signer email address',
    validateOn: 'blur',
    extraComponentProperties: {},
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
    validateOn: {table: {disable: true}},
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

export const Cosign = {
  render: SingleFormioComponent,
  args: {
    key: 'cosign',
    label: 'Co-signer email address',
  },
};
