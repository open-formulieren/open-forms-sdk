import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Vanilla / DateTimeField',
  args: {
    type: 'datetime',
    extraComponentProperties: {
      format: 'dd-MM-yyyy HH:mm',
      placeholder: 'dd-MM-yyyy HH:mm',
      enableTime: true,
      time_24hr: true,
      timePicker: {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: false,
        readonlyInput: false,
        mousewheel: true,
        arrowkeys: true,
      },
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

export const DateTimeField = {
  render: SingleFormioComponent,
  args: {
    key: 'datetime',
    label: 'Datum / tijd',
  },
};
