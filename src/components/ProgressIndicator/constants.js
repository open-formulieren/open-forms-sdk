import {FormattedMessage} from 'react-intl';
import React from 'react';

const STEP_LABELS = {
  login: <FormattedMessage description="Start page title" defaultMessage="Log in" />,
  overview: <FormattedMessage description="Summary page title" defaultMessage="Summary" />,
  confirmation: (
    <FormattedMessage description="Confirmation page title" defaultMessage="Confirmation" />
  ),
};

export {STEP_LABELS};
