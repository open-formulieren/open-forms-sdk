import {expect} from '@storybook/jest';
import {waitFor, within} from '@storybook/testing-library';

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

    await waitFor(async () => {
      const abortButton = await canvas.queryByRole('button', {name: 'Uitloggen'});
      await expect(abortButton).toBeVisible();
    });
  },
};

export const GovMetricEnabled = {
  args: {
    isAuthenticated: false,
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const abortButton = await canvas.queryByRole('button', {name: 'Abort submission'});
      await expect(abortButton).toBeVisible();
    });
  },
};

export const AuthenticatedAndGovmetric = {
  args: {
    isAuthenticated: true,
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const abortButton = await canvas.queryByRole('button', {name: 'Uitloggen'});
      await expect(abortButton).toBeVisible();
    });
  },
};

export const NotAuthenticatedNoGovMetric = {
  args: {
    isAuthenticated: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const abortButton = await canvas.queryByRole('button');
      await expect(abortButton).toBeNull();
    });
  },
};
