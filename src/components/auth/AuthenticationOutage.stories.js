import AuthenticationOutage from './AuthenticationOutage';

export default {
  title: 'Private API / Authentication Outage',
  render: ({label}) => <AuthenticationOutage loginOption={{label}} />,
};

export const AuthenticationOutageStory = {
  name: 'Authentication Outage',
  args: {
    label: 'DigiD',
  },
};
