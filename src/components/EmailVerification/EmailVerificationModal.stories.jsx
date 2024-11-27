import {fn} from '@storybook/test';

import {BASE_URL} from 'api-mocks';
import {ConfigDecorator} from 'story-utils/decorators';

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
};

export const Default = {};
