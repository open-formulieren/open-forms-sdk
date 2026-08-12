import type {Meta, StoryObj} from '@storybook/react-vite';

import Body, {VARIANTS} from './Body';

export default {
  title: 'Pure React components / Body',
  component: Body,
  args: {
    children: 'Body',
    modifiers: [],
  },
  argTypes: {
    children: {table: {disable: true}},
    component: {control: {disable: true}},
    modifiers: {
      options: VARIANTS,
      control: {
        type: 'check',
      },
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
} satisfies Meta<typeof Body>;

type Story = StoryObj<typeof Body>;

export const Default: Story = {
  args: {
    children: 'Lorem ipsum...',
    modifiers: [],
  },
};
