import {withUtrechtDocument} from 'story-utils/decorators';

import {MultipleFormioComponents} from './story-util';

export default {
  title: 'Form.io components / Custom / SoftRequiredErrors',
  decorators: [withUtrechtDocument],
  render: MultipleFormioComponents,
  args: {
    components: [
      {
        type: 'file',
        key: 'file',
        storage: 'url',
        url: '/dummy',
        label: 'File',
        multiple: false,
        openForms: {softRequired: true},
      },
      {type: 'textfield', key: 'textfield', label: 'Text', openForms: {softRequired: true}},
      {
        type: 'softRequiredErrors',
        html: `
        <p>Not all required fields are filled out. That can get expensive!</p>

        {{ missingFields }}

        <p>Are you sure you want to continue?</p>
          `,
      },
    ],
  },

  argTypes: {
    components: {table: {disable: true}},
    evalContext: {table: {disable: true}},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
};

export const Default = {};
