import type {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';

import ExistingSubmissionOptions from './ExistingSubmissionOptions';

export default {
  title: 'Private API / Existing Submission Options',
  component: ExistingSubmissionOptions,
  decorators: [withRouter],
  args: {
    form: buildForm(),
  },
  argTypes: {
    form: {control: false},
  },
} satisfies Meta<typeof ExistingSubmissionOptions>;

type Story = StoryObj<typeof ExistingSubmissionOptions>;

export const Default: Story = {
  args: {
    isAuthenticated: false,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    await expect(abortButton).toBeVisible();
  },
};

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
