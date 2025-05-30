import {expect, userEvent, waitFor, within} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import {SingleFormioComponent} from '../story-util';

export default {
  title: 'Form.io components / Custom / Partners',
  decorators: [ConfigDecorator],
  args: {
    type: 'partners',
    key: 'partners',
    label: 'Partners',
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
  },
};

export const NoPartnerData = {
  render: SingleFormioComponent,
};
