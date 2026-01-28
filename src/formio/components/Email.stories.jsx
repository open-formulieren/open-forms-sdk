import {fn} from 'storybook/test';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Email',
  args: {
    type: 'email',
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

export const Email = {
  render: SingleFormioComponent,
  args: {
    key: 'email',
    label: 'E-mailadres',
  },
};

export const EmailWithVerification = {
  render: SingleFormioComponent,
  args: {
    key: 'email',
    label: 'Email address requiring verification',
    extraComponentProperties: {
      openForms: {
        requireVerification: true,
      },
    },
    ofContext: {
      verifyEmailCallback: fn(),
    },
  },
};

export const MultipleEmailWithVerification = {
  render: SingleFormioComponent,
  args: {
    key: 'email',
    label: 'Email address requiring verification',
    extraComponentProperties: {
      multiple: true,
      openForms: {
        requireVerification: true,
      },
    },
    ofContext: {
      verifyEmailCallback: fn(),
    },
  },
};
