import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / DateField',
  decorators: [withUtrechtDocument],
  args: {
    type: 'date',
    extraComponentProperties: {
      format: 'dd-MM-yyyy',
      placeholder: 'dd-mm-yyyy',
      enableTime: false,
      datePicker: {
        minDate: null,
        maxDate: null,
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

export const DateField = {
  render: SingleFormioComponent,
  args: {
    key: 'date',
    label: 'Datum',
  },
};
