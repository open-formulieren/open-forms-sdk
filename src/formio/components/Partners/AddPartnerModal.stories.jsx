import {fn} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import AddPartnerModal from './AddPartnerModal';

export default {
  title: 'Private API / Partners / Modal',
  component: AddPartnerModal,
  decorators: [ConfigDecorator],
  args: {
    isOpen: true,
    closeModal: fn(),
    componentKey: 'partners',
  },
};

export const Default = {};
