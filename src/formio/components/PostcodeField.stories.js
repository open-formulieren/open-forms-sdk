import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Deprecated / PostcodeField',
  args: {
    type: 'postcode',
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

export const PostcodeField = {
  render: SingleFormioComponent,
  args: {
    key: 'postcode',
    label: 'Postcode',
  },
};
