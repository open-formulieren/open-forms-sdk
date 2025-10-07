import type {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';

import AbortButton from './AbortButton';

export default {
  title: 'Private API / Abort button',
  component: AbortButton,
} satisfies Meta<typeof AbortButton>;

type Story = StoryObj<typeof AbortButton>;

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};

export const Anonymous: Story = {
  args: {
    isAuthenticated: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    await expect(abortButton).toBeVisible();
  },
};

export const AnonymousAndGovMetric: Story = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceIdFormAborted: '1234',
      govmetricSecureGuidFormAborted: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    await expect(abortButton).toBeVisible();
  },
};

export const AuthenticatedAndGovmetric: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceIdFormAborted: '1234',
      govmetricSecureGuidFormAborted: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};
