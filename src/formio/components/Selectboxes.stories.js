import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Selectboxes',
  decorators: [withUtrechtDocument],
  args: {
    type: 'selectboxes',
    extraComponentProperties: {
      values: [
        {
          label: 'Optie A',
          value: 'selectA',
        },
        {
          label: 'Optie B',
          value: 'selectB',
          description: 'Description optie B'
        },
        {
          label:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          value: 'selectC',
        },
      ],
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

export const Default = {
  render: SingleFormioComponent,
  args: {
    key: 'selectboxes',
    label: 'Welke opties wilt u allemaal?',
  },
};

export const Required = {
  render: SingleFormioComponent,
  args: {
    key: 'selectboxes',
    label: 'Kunt u niet zeggen: „Wat mot je?”?',
    extraComponentProperties: {
      validate: {required: true},
      values: [{label: 'Vezélf', value: 'see Westfries woordenboek'}],
    },
  },
};
