import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Radio',
  args: {
    type: 'radio',
    extraComponentProperties: {
      values: [
        {
          label: 'Optie A',
          value: 'radioA',
        },
        {
          label: 'Optie B',
          value: 'radioB',
        },
        {
          label:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          value: 'radioC',
          description: 'Description optie C',
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

export const Radio = {
  render: SingleFormioComponent,
  args: {
    key: 'radio',
    label: 'Welke optie is het meest onduidelijk?',
  },
};
