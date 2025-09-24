import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';

import {ConfigDecorator} from 'story-utils/decorators';

import {BASE_URL} from '@/api-mocks';

import {EmailVerificationModal} from './index';
import {mockEmailVerificationPost, mockEmailVerificationVerifyCodePost} from './mocks';

export default {
  title: 'Private API / Email verification / Modal',
  component: EmailVerificationModal,
  decorators: [ConfigDecorator],
  args: {
    isOpen: true,
    closeModal: fn(),
    submissionUrl: `${BASE_URL}submissions/123`,
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
