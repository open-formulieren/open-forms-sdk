import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / PhoneNumberField',
  decorators: [withUtrechtDocument],
  args: {
    type: 'phoneNumber',
    extraComponentProperties: {
      inputMask: null,
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

export const PhoneNumberField = {
  render: SingleFormioComponent,
  args: {
    key: 'phoneNumber',
    label: 'Telefoonnummer',
  },
};
