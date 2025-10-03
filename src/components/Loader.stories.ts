import type {Meta, StoryObj} from '@storybook/react';

import _Loader, {MODIFIERS} from './Loader';

export default {
  title: 'Pure React Components / Loader',
  component: _Loader,
  args: {
    modifiers: [],
    withoutTranslation: true,
  },
  argTypes: {
    modifiers: {
      options: MODIFIERS,
      control: {
        type: 'check',
      },
    },
  },
  parameters: {
    chromatic: {disableSnapshot: true},
  },
} satisfies Meta<typeof _Loader>;

type Story = StoryObj<typeof _Loader>;

export const Loader: Story = {};
