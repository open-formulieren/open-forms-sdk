import {expect, fn, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {BASE_URL} from 'api-mocks';
import {ConfigDecorator} from 'story-utils/decorators';

import {EmailVerificationForm} from '.';
import {
  mockEmailVerificationErrorPost,
  mockEmailVerificationPost,
  mockEmailVerificationVerifyCodePost,
} from './mocks';

export default {
  title: 'Private API / Email verification / Modal content',
  component: EmailVerificationForm,
  decorators: [ConfigDecorator, withRouter],
  args: {
    submissionUrl: `${BASE_URL}submissions/123`,
    emailAddress: 'openforms@example.com',
    componentKey: 'emailWithVerificationRequirement',
    onVerified: fn(),
  },
  parameters: {
    msw: {
      handlers: [mockEmailVerificationPost, mockEmailVerificationVerifyCodePost],
    },
  },
};

export const Default = {};

export const HappyFlow = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Send code'}));
    const codeInput = await canvas.findByLabelText('Enter the six-character code');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'ABCD12');
    await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));
  },
};

export const ArbitrarySendCodeErrorFlow = {
  parameters: {
    msw: {
      handlers: [mockEmailVerificationErrorPost, mockEmailVerificationVerifyCodePost],
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Send code'}));
    expect(await canvas.findByText('No permission to perform this action.')).toBeVisible();
  },
};

export const InvalidCodeFlow = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Send code'}));
    const codeInput = await canvas.findByLabelText('Enter the six-character code');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'FAILME'); // mock returns validation error
    await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));

    expect(await canvas.findByText('Not a valid verification code')).toBeVisible();
  },
};

export const ArbitraryVerificationErrorFlow = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Send code'}));
    const codeInput = await canvas.findByLabelText('Enter the six-character code');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'NOPERM'); // mock returns 403
    await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));

    expect(await canvas.findByText('No permission to perform this action.')).toBeVisible();
  },
};
