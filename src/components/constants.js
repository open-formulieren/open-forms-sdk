import {FormattedMessage} from 'react-intl';

const SUBMISSION_ALLOWED = {
  yes: 'yes',
  noWithOverview: 'no_with_overview',
  noWithoutOverview: 'no_without_overview',
};

const STEP_LABELS = {
  login: <FormattedMessage description="Start page title" defaultMessage="Start page" />,
  overview: <FormattedMessage description="Summary page title" defaultMessage="Summary" />,
  confirmation: (
    <FormattedMessage description="Confirmation page title" defaultMessage="Confirmation" />
  ),
};

const START_FORM_QUERY_PARAM = '_start';

const SUBMISSION_UUID_QUERY_PARAM = 'submission_uuid';

export {SUBMISSION_ALLOWED, START_FORM_QUERY_PARAM, SUBMISSION_UUID_QUERY_PARAM, STEP_LABELS};
