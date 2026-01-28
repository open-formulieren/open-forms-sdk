import type {Meta, StoryObj} from '@storybook/react-vite';

import Body from './Body';
import Card from './Card';

export default {
  title: 'Pure React components / Card',
  component: Card,
  argTypes: {
    children: {control: false},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'The Rig',
    children: <Body>By Blanck Mass</Body>,
    mobileHeaderHidden: false,
  },
};
