import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / BSNField',
  args: {
    type: 'bsn',
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

export const BSNField = {
  render: SingleFormioComponent,
  args: {
    key: 'bsn',
    label: 'BSN (burgerservicenummer)',
  },
};
