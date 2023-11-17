import {FormattedMessage, defineMessages} from 'react-intl';

const SUBMISSION_ALLOWED = {
  yes: 'yes',
  noWithOverview: 'no_with_overview',
  noWithoutOverview: 'no_without_overview',
};

const STEP_LABELS = defineMessages({
  login: {id: 'Start page title', defaultMessage: 'Start page'},
  overview: {id: 'Summary page title', defaultMessage: 'Summary'},
  confirmation: {id: 'Confirmation page title', defaultMessage: 'Confirmation'},
});

const START_FORM_QUERY_PARAM = '_start';

const SUBMISSION_UUID_QUERY_PARAM = 'submission_uuid';

const PI_TITLE = (
  <FormattedMessage description="Title of progress indicator" defaultMessage="Progress" />
);

export {
  SUBMISSION_ALLOWED,
  START_FORM_QUERY_PARAM,
  SUBMISSION_UUID_QUERY_PARAM,
  STEP_LABELS,
  PI_TITLE,
};
