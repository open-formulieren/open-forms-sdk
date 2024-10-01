import ErrorMessage from './ErrorMessage';
import {ALERT_MODIFIERS} from './ErrorMessage';

export default {
  title: 'Private API / Error Message',
  render: ({message, modifier}) => <ErrorMessage modifier={modifier}>{message}</ErrorMessage>,
  argTypes: {
    modifier: {
      options: ALERT_MODIFIERS,
      control: {
        type: 'radio',
      },
    },
    children: {control: false},
  },
};

export const ErrorMessageErrorStory = {
  name: 'Error Message',
  args: {
    modifier: 'error',
    message: 'Sadness, something went wrong.',
  },
};

export const ErrorMessageOkStory = {
  name: 'Ok Message',
  args: {
    modifier: 'ok',
    message: 'Something went OK.',
  },
};

export const ErrorMessageInfoStory = {
  name: 'Info Message',
  args: {
    modifier: 'info',
    message: 'This is an info!',
  },
};

export const ErrorMessageWarningStory = {
  name: 'Warning Message',
  args: {
    modifier: 'warning',
    message: 'You are being warned.',
  },
};
