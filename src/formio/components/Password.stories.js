import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Deprecated / Password',
  decorators: [withUtrechtDocument],
  args: {
    type: 'password',
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

export const Password = {
  render: SingleFormioComponent,
  args: {
    key: 'password',
    label: 'Wachtwoord',
  },
};
