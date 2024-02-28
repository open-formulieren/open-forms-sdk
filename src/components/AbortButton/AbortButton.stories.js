import {expect} from '@storybook/jest';
import {within} from '@storybook/testing-library';

import {AnalyticsToolsDecorator} from 'story-utils/decorators';

import AbortButton from './AbortButton';

export default {
  title: 'Private API / Abort button',
  component: AbortButton,
  decorators: [AnalyticsToolsDecorator],
};

export const Authenticated = {
  args: {
    isAuthenticated: true,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};

export const Anonymous = {
  args: {
    isAuthenticated: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Afbreken'});
    await expect(abortButton).toBeVisible();
  },
};

export const AnonymousAndGovMetric = {
  args: {
    isAuthenticated: false,
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Afbreken'});
    await expect(abortButton).toBeVisible();
  },
};

export const AuthenticatedAndGovmetric = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};
