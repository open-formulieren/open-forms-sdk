import type {Meta, StoryObj} from '@storybook/react';

import Anchor, {ANCHOR_MODIFIERS} from './index';

export default {
  title: 'Pure React components / Anchor',
  component: Anchor,
  args: {
    children: 'Label',
    href: 'https://example.com',
    target: '_blank',
  },
  argTypes: {
    modifiers: {
      options: ANCHOR_MODIFIERS,
      control: {
        type: 'check',
      },
    },
    onClick: {control: false},
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
  },
} satisfies Meta<typeof Anchor>;

type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  args: {
    children: 'Anchor/link',
  },
};

export const Hover: Story = {
  args: {
    modifiers: ['hover'],
    children: 'Hover',
  },
};

export const Inherit: Story = {
  args: {
    modifiers: ['inherit'],
    children: 'Inherit',
  },
};

/**
 * A placeholder link indicating that the link may become available.
 *
 * The link is currently not active/clickable/enabled because of some state, but
 * depending on context it may become a regular link. The `href` attribute is removed,
 * which removes the link from the tab/focus navigation while keeping a consistent
 * markup.
 */
export const Placeholder: Story = {
  args: {
    children: 'placeholder',
    placeholder: true,
  },
};

/**
 * A link indicating the current page.
 *
 * Typically you can navigate to this link, but it will just take you to the same page.
 * While the link is enabled and can be clicked, the styling does not *encourage* users
 * to click it by rendering the default cursor instead.
 */
export const Current: Story = {
  args: {
    modifiers: ['current'],
    children: 'Current',
  },
};
