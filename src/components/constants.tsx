import {FormattedMessage, defineMessages} from 'react-intl';

const STEP_LABELS = defineMessages({
  introduction: {
    description: 'introduction page title',
    defaultMessage: 'Introduction',
  },
  login: {
    description: 'Start page title',
    defaultMessage: 'Start page',
  },
  overview: {
    description: 'Summary page title',
    defaultMessage: 'Summary',
  },
  confirmation: {
    description: 'Confirmation page title',
    defaultMessage: 'Confirmation',
  },
  payment: {
    description: 'Payment page title',
    defaultMessage: 'Payment',
  },
});

const START_FORM_QUERY_PARAM = '_start';

const SUBMISSION_UUID_QUERY_PARAM = 'submission_uuid';

const PI_TITLE = (
  <FormattedMessage description="Title of progress indicator" defaultMessage="Progress" />
);

export {START_FORM_QUERY_PARAM, SUBMISSION_UUID_QUERY_PARAM, STEP_LABELS, PI_TITLE};
