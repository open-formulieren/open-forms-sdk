import type {Meta, StoryObj} from '@storybook/react';

import AuthenticationError from './AuthenticationError';
import {type AuthErrorCode, MAPPING_PARAMS_SERVICE} from './constants';

export default {
  title: 'Private API / Authentication Errors',
  component: AuthenticationError,
  args: {
    parameter: '_digid-message',
    errorCode: 'error',
  },

  argTypes: {
    parameter: {
      options: MAPPING_PARAMS_SERVICE.map(([key]) => key),
      control: {
        type: 'radio',
      },
    },
    errorCode: {
      options: ['login-cancelled', 'error'] satisfies AuthErrorCode[],
      control: {
        type: 'radio',
      },
    },
  },
} satisfies Meta<typeof AuthenticationError>;

type Story = StoryObj<typeof AuthenticationError>;

export const AuthenticationErrorsStory: Story = {
  name: 'Authentication Error',
};
