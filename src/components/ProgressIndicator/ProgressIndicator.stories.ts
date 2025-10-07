import type {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import ProgressIndicator from './index';

export default {
  title: 'Private API / ProgressIndicator',
  component: ProgressIndicator,
  decorators: [withRouter],
  args: {
    title: 'Progress',
    formTitle: 'Formulier',
    steps: [
      {
        to: 'start-page',
        label: 'Start page',
        isCompleted: true,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: true,
      },
      {
        to: 'first-step',
        label: 'Stap 1',
        isCompleted: false,
        isApplicable: false,
        isCurrent: false,
        canNavigateTo: false,
      },
      {
        to: 'second-step',
        label: 'Stap 2',
        isCompleted: false,
        isApplicable: true,
        isCurrent: true,
        canNavigateTo: true,
      },
      {
        to: 'summary-page',
        label: 'Summary',
        isCompleted: false,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: false,
      },
      {
        to: 'confirmation-page',
        label: 'Confirmation',
        isCompleted: false,
        isApplicable: true,
        isCurrent: false,
        canNavigateTo: false,
      },
    ],
    ariaMobileIconLabel: 'Progress step indicator toggle icon (mobile)',
    accessibleToggleStepsLabel: 'Current step in form Formulier: Stap 2',
  },
} satisfies Meta<typeof ProgressIndicator>;

type Story = StoryObj<typeof ProgressIndicator>;

export const Default: Story = {};

export const MobileViewport: Story = {
  name: 'Mobile version',
  parameters: {
    viewport: {
      defaultViewport: 'smallMobile',
    },
    chromatic: {
      modes: {
        desktop: {disable: true},
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const toggleButton = await canvas.findByRole('button');
    await expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggleButton);
  },
  tags: ['!test'],
};
