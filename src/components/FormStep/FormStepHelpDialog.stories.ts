import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import FormStepHelpDialog from './FormStepHelpDialog';

export default {
  title: 'Private API / FormStep / FormStepHelpDialog',
  component: FormStepHelpDialog,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const helpButton = canvas.getByRole('button', {name: 'Hulp'});
    expect(helpButton).toBeVisible();

    await userEvent.click(helpButton);
  },
} satisfies Meta<typeof FormStepHelpDialog>;

type Story = StoryObj<typeof FormStepHelpDialog>;

export const ContentOnly: Story = {
  args: {
    content: `<p>Rich <b>text</b> <em>content</em></p>`,
    image: '',
  },
};

export const ContentAndImage: Story = {
  args: {
    content: `<p>Rich <b>text</b> <em>content</em></p>`,
    image: './eidas.png',
  },
};
