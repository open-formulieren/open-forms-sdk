import {AuthenticationErrors, CANCEL_LOGIN_PARAM, MAPPING_PARAMS_SERVICE} from './index';

export default {
  title: 'Private API / Authentication Errors',
  render: ({parameter, message}) => <AuthenticationErrors parameters={{[parameter]: message}} />,
  argTypes: {
    parameter: {
      options: Object.keys(MAPPING_PARAMS_SERVICE),
      control: {
        type: 'radio',
      },
    },
    message: {
      options: [CANCEL_LOGIN_PARAM, 'error'],
      control: {
        type: 'radio',
      },
    },
  },
};

export const AuthenticationErrorsStory = {
  name: 'Authentication Error',
  args: {
    parameter: '_digid-message',
    message: 'error',
  },
};
