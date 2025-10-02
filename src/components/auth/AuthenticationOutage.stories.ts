import type {Meta, StoryObj} from '@storybook/react';

import AuthenticationOutage from './AuthenticationOutage';

export default {
  title: 'Private API / Authentication Outage',
  component: AuthenticationOutage,
  args: {
    loginOption: {
      label: 'DigiD',
      identifier: 'digid',
      url: '',
      isForGemachtigde: false,
    },
  },
} satisfies Meta<typeof AuthenticationOutage>;

type Story = StoryObj<typeof AuthenticationOutage>;

export const AuthenticationOutageStory: Story = {
  name: 'Authentication Outage',
};
