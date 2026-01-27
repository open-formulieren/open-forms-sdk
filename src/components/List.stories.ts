import type {Meta, StoryObj} from '@storybook/react-vite';

import List from './List';

export default {
  title: 'Pure React components / List',
  component: List,
  args: {
    children: ['First', 'Second'],
    ordered: false,
  },
} satisfies Meta<typeof List>;

type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  args: {
    ordered: false,
  },
};

export const Ordered: Story = {
  args: {
    ordered: true,
  },
};

export const DashVariant: Story = {
  args: {
    withDash: true,
  },
};

export const ExtraCompactVariant: Story = {
  args: {
    extraCompact: true,
  },
};
