import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / Select',
  decorators: [withUtrechtDocument],
  args: {
    type: 'select',
    extraComponentProperties: {
      data: {
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
            label: 'Optie C',
            value: 'radioC',
          },
        ],
      },
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

export const Select = {
  render: SingleFormioComponent,
  args: {
    key: 'select',
    label: 'Welke optie is het meest onduidelijk?',
  },
};
