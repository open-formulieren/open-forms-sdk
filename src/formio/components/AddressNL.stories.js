import {withUtrechtDocument} from 'story-utils/decorators';
import {ConfigDecorator} from 'story-utils/decorators';

import {mockBRKZaakgerechtigdeInvalidPost} from './AddressNL.mocks';
import {SingleFormioComponent} from './story-util';

export default {
  title: 'Form.io components / Custom / Address NL',
  decorators: [withUtrechtDocument, ConfigDecorator],
  parameters: {
    msw: {
      handlers: [mockBRKZaakgerechtigdeInvalidPost],
    },
  },
  args: {
    type: 'addressNL',
    key: 'addressNL',
    label: 'Address NL',
    extraComponentProperties: {
      validate: {
        required: true,
      },
    },
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
  },
};

export const Default = {
  render: SingleFormioComponent,
};

export const WithBRKValidation = {
  render: SingleFormioComponent,
  args: {
    extraComponentProperties: {
      validate: {
        required: false,
        plugins: ['brk-Zaakgerechtigde'],
      },
    },
  },
};
