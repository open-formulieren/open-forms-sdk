import type {Meta, StoryObj} from '@storybook/react';
import {LinkButton} from '@utrecht/component-library-react';

import FAIcon from '../FAIcon';
import OFButton from './OFButton';

export default {
  title: 'Pure React components / OF Button',
  component: OFButton,
  argTypes: {
    children: {type: 'string'},
  },
} satisfies Meta<typeof OFButton>;

type Story = StoryObj<typeof OFButton>;

export const UtrechtDefault: Story = {
  args: {
    children: 'Default',
  },
};

export const UtrechtPrimary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

export const UtrechtSecondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const UtrechtDanger: Story = {
  args: {
    children: 'Danger',
    variant: 'primary',
    hint: 'danger',
  },
};

export const UtrechtButtonLooksLikeLink: StoryObj<typeof LinkButton> = {
  render: args => <LinkButton {...args} />,
  args: {
    children: 'Link-like button',
  },
};

export const UtrechtIconButton: Story = {
  args: {
    children: <FAIcon icon="pen" />,
    appearance: 'subtle-button',
  },
};

export const UtrechtIconButtonDanger: Story = {
  args: {
    children: <FAIcon icon="pen" />,
    appearance: 'subtle-button',
    hint: 'danger',
  },
};

export const UtrechtButtonDisabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
};
