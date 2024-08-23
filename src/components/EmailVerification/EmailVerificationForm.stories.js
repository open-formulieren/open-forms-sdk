import {expect, userEvent, within} from '@storybook/test';

import {BASE_URL} from 'api-mocks';
import {ConfigDecorator} from 'story-utils/decorators';

import {EmailVerificationForm} from '.';
import {mockEmailVerificationPost} from './mocks';

export default {
  title: 'Private API / Email verification / Modal content',
  component: EmailVerificationForm,
  decorators: [ConfigDecorator],
  args: {
    submissionUrl: `${BASE_URL}submissions/123`,
    emailAddress: 'openforms@example.com',
    componentKey: 'emailWithVerificationRequirement',
  },
  parameters: {
    msw: {
      handlers: [mockEmailVerificationPost],
    },
  },
};

export const Default = {};

export const Flow = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Send code'}));
    const codeInput = await canvas.findByLabelText('Enter the six-character code');
    expect(codeInput).toBeVisible();
    await userEvent.type(codeInput, 'ABCD12');
    await userEvent.click(canvas.getByRole('button', {name: 'Verify'}));
  },
};
