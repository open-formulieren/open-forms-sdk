import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from 'storybook/test';

import AddChildModal from './AddChildModal';
import type Children from './Children';

export default {
  title: 'Private API / Children / Modal',
  component: AddChildModal,
  args: {
    childValues: null,
    isOpen: true,
    closeModal: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof AddChildModal>;

export const Default: StoryObj<Children> = {};

export const EditChild: StoryObj<Children> = {
  args: {
    childValues: {
      bsn: '123456789',
      firstNames: 'Peter',
      dateOfBirth: '2000-1-1',
      __addedManually: false,
      __id: crypto.randomUUID(),
      selected: null,
    },
  },
};
