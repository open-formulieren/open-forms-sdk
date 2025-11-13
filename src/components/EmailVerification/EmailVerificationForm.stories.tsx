import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {BASE_URL, buildSubmission} from '@/api-mocks';

import {EmailVerificationForm} from './index';
import {
  mockEmailVerificationErrorPost,
  mockEmailVerificationPost,
  mockEmailVerificationVerifyCodePost,
} from './mocks';

export default {
  title: 'Private API / Email verification / Modal content',
  component: EmailVerificationForm,
  decorators: [withRouter],
  args: {
    submission: buildSubmission({url: `${BASE_URL}submissions/123`}),
    emailAddress: 'openforms@example.com',
    componentKey: 'emailWithVerificationRequirement',
    onVerified: fn(),
  },
  parameters: {
    msw: {
      handlers: [mockEmailVerificationPost, mockEmailVerificationVerifyCodePost],
    },
  },
} satisfies Meta<typeof EmailVerificationForm>;

type Story = StoryObj<typeof EmailVerificationForm>;

export const Default: Story = {};

export const HappyFlow: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Verstuur code'}));
    const codeInput = await canvas.findByLabelText('Voer de bevestigingscode in');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'abcd12');
    expect(codeInput).toHaveValue('ABCD12'); // automatically convert to uppercase
    await userEvent.click(canvas.getByRole('button', {name: 'Bevestigen'}));
  },
};

export const ArbitrarySendCodeErrorFlow: Story = {
  parameters: {
    msw: {
      handlers: [mockEmailVerificationErrorPost, mockEmailVerificationVerifyCodePost],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Verstuur code'}));
    expect(await canvas.findByText('No permission to perform this action.')).toBeVisible();
  },
};

export const InvalidCodeFlow: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Verstuur code'}));
    const codeInput = await canvas.findByLabelText('Voer de bevestigingscode in');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'FAILME'); // mock returns validation error
    await userEvent.click(canvas.getByRole('button', {name: 'Bevestigen'}));

    expect(await canvas.findByText('Not a valid verification code')).toBeVisible();
  },
};

export const ArbitraryVerificationErrorFlow: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Verstuur code'}));
    const codeInput = await canvas.findByLabelText('Voer de bevestigingscode in');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'NOPERM'); // mock returns 403
    await userEvent.click(canvas.getByRole('button', {name: 'Bevestigen'}));

    expect(await canvas.findByText('No permission to perform this action.')).toBeVisible();
  },
};

export const NoAsterisks: Story = {
  name: 'No asterisk for required fields',
  parameters: {
    config: {
      requiredFieldsWithAsterisk: false,
    },
  },
};
