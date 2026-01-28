import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {buildForm, buildSubmission} from '@/api-mocks';

import type FormStepNewRenderer from './FormStepNewRenderer';
import FormStepNewRendererStories from './FormStepNewRenderer.stories';

export default {
  ...FormStepNewRendererStories,
  title: 'Private API / FormStep / New Renderer / Navigation buttons',
} satisfies Meta<typeof FormStepNewRenderer>;

type Story = StoryObj<typeof FormStepNewRenderer>;

export const SuspensionDisallowed: Story = {
  name: 'Suspension disallowed',
  parameters: {
    formContext: {
      form: buildForm({suspensionAllowed: false}),
    },
  },
};

export const Authenticated: Story = {
  parameters: {
    submissionContext: {
      submission: buildSubmission({isAuthenticated: true}),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Uitloggen'});
    await expect(abortButton).toBeVisible();
  },
};

export const GovmetricEnabled: Story = {
  name: 'GovMetric enabled',
  parameters: {
    analyticsToolsParams: {
      govmetricSourceId: '1234',
      govmetricSecureGuid: '',
      enableGovmetricAnalytics: true,
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    await expect(abortButton).toBeVisible();
  },
};
