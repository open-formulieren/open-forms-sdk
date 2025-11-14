import {
  Button,
  PrimaryActionButton,
  SecondaryActionButton,
  SubtleButton,
} from '@open-formulieren/formio-renderer';
import type {Meta, StoryObj} from '@storybook/react';
// TODO: wrap and blocklist in formio-renderer for disabled state
import {LinkButton} from '@utrecht/component-library-react';

import FAIcon from '../FAIcon';

export default {
  title: 'Pure React components / OF Button',
  component: Button,
  argTypes: {
    children: {table: {disable: true}},
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const UtrechtDefault: Story = {
  render: args => <Button {...args} />,
  args: {
    children: 'Default',
  },
};

export const UtrechtPrimary: Story = {
  render: args => <PrimaryActionButton {...args} />,
  args: {
    children: 'Primary',
  },
};

export const UtrechtSecondary: Story = {
  render: args => <SecondaryActionButton {...args} />,
  args: {
    children: 'Secondary',
  },
};

export const UtrechtDanger: Story = {
  render: args => <PrimaryActionButton {...args} />,
  args: {
    children: 'Danger',
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
  render: args => <SubtleButton {...args} />,
  args: {
    children: <FAIcon icon="pen" />,
  },
};

export const UtrechtIconButtonDanger: Story = {
  render: args => <SubtleButton {...args} />,
  args: {
    children: <FAIcon icon="pen" />,
    hint: 'danger',
  },
};

export const UtrechtButtonDisabled: Story = {
  render: args => <PrimaryActionButton {...args} />,
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
