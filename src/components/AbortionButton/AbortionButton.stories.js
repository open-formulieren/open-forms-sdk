import {expect} from '@storybook/jest';
import {within} from '@storybook/testing-library';

import {AnalyticsToolsDecorator} from 'story-utils/decorators';

import AbortionButton from './AbortionButton';

export default {
  title: 'Private API / Abortion button',
  component: AbortionButton,
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

export const GovMetricEnabled = {
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

export const NotAuthenticatedNoGovMetric = {
  args: {
    isAuthenticated: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.queryByRole('button');
    await expect(abortButton).toBeNull();
  },
};
