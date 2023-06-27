import {withUtrechtDocument} from 'story-utils/decorators';

import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / LicensePlateField',
  decorators: [withUtrechtDocument],
  args: {
    type: 'licenseplate',
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

export const LicensePlateField = {
  render: SingleFormioComponent,
  args: {
    key: 'licenseplate',
    label: 'Kentekennummer',
  },
};
