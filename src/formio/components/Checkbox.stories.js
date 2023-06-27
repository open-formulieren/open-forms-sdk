import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Checkbox',
  decorators: [withUtrechtDocument],
  args: {
    type: 'checkbox',
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

export const Default = {
  render: SingleFormioComponent,
  args: {
    key: 'agree-terms',
    label: 'Ik ga akkoord met de voorwaarden',
  },
};

export const Required = {
  render: SingleFormioComponent,
  args: {
    key: 'agree-terms',
    label: 'Ik ga akkoord met de voorwaarden',
    extraComponentProperties: {
      validate: {
        required: true,
      },
    },
  },
};

export const Optional = {
  render: SingleFormioComponent,
  args: {
    key: 'agree-terms',
    label: 'Ik ga akkoord met de voorwaarden',
    evalContext: {requiredFieldsWithAsterisk: false},
  },
};

export const RequiredNoAsterisk = {
  name: 'Required no asterisk',
  render: SingleFormioComponent,
  args: {
    key: 'agree-terms',
    label: 'Ik ga akkoord met de voorwaarden',
    extraComponentProperties: {
      validate: {
        required: true,
      },
    },
    evalContext: {requiredFieldsWithAsterisk: false},
  },
};
