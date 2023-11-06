import AuthenticationOutage from './AuthenticationOutage';

export default {
  title: 'Private API / Authentication Outage',
  component: AuthenticationOutage,
  args: {
    loginOption: {
      label: 'DigiD',
    },
  },
};

export const AuthenticationOutageStory = {
  name: 'Authentication Outage',
  args: {
    label: 'DigiD',
  },
};
