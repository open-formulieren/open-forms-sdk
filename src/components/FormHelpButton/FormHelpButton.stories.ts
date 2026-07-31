import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fn, userEvent, within} from 'storybook/test';

import FormHelpButton from './FormHelpButton';

export default {
  title: 'Private API / FormHelpButton',
  component: FormHelpButton,
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof FormHelpButton>;

type Story = StoryObj<typeof FormHelpButton>;

export const Enabled: Story = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');
    await userEvent.click(button);
    expect(args.onClick).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(button);
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
