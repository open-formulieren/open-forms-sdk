import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / IBANField',
  args: {
    type: 'iban',
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

export const IBANField = {
  render: SingleFormioComponent,
  args: {
    key: 'iban',
    label: 'IBAN (bankrekening)',
  },
};
