import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Currency',
  args: {
    type: 'currency',
    extraComponentProperties: {
      currency: 'EUR',
      decimalLimit: 2,
      allowNegative: true,
    },
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
    extraComponentProperties: {
      description: `Any additional Form.io component properties, recursively merged into the
        component definition.`,
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Currency = {
  render: SingleFormioComponent,
  args: {
    key: 'currency',
    label: 'Bedrag',
  },
};
