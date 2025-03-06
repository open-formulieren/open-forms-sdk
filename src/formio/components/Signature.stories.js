import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Signature',
  args: {
    type: 'signature',
    extraComponentProperties: {
      description: 'Plaats hierboven uw handtekening',
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

export const Signature = {
  render: SingleFormioComponent,
  args: {
    key: 'signature',
    label: 'Handtekening',
  },
};
