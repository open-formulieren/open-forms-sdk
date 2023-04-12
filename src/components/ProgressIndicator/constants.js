import React from 'react';
import {FormattedMessage} from 'react-intl';

const STEP_LABELS = {
  login: <FormattedMessage description="Start page title" defaultMessage="Start page" />,
  overview: <FormattedMessage description="Summary page title" defaultMessage="Summary" />,
  confirmation: (
    <FormattedMessage description="Confirmation page title" defaultMessage="Confirmation" />
  ),
  appointment: (
    <FormattedMessage description="Appointment page title" defaultMessage="Appointment" />
  ),
};

export {STEP_LABELS};
