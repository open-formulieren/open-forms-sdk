import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {BASE_URL, buildSubmission} from '@/api-mocks';

import {EmailVerificationModal} from './index';
import {mockEmailVerificationPost, mockEmailVerificationVerifyCodePost} from './mocks';

export default {
  title: 'Private API / Email verification / Modal',
  component: EmailVerificationModal,
  args: {
    isOpen: true,
    closeModal: fn(),
    submission: buildSubmission({url: `${BASE_URL}submissions/123`}),
    emailAddress: 'openforms@example.com',
    componentKey: 'emailWithVerificationRequirement',
  },
  parameters: {
    msw: {
      handlers: [mockEmailVerificationPost, mockEmailVerificationVerifyCodePost],
    },
  },
} satisfies Meta<typeof EmailVerificationModal>;

type Story = StoryObj<typeof EmailVerificationModal>;

export const Default: Story = {};
