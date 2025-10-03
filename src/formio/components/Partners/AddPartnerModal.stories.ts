import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {AddPartnerModal} from './AddPartnerModal';
import type Partners from './Partners';

export default {
  title: 'Private API / Partners / Modal',
  component: AddPartnerModal,
  args: {
    partner: null,
    isOpen: true,
    closeModal: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof AddPartnerModal>;

export const Default: StoryObj<Partners> = {};
