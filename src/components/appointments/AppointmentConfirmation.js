import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import Body from 'components/Body';
import Card from 'components/Card';
import Loader from 'components/Loader';
import useTitle from 'hooks/useTitle';

const AppointmentConfirmation = () => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    description: 'Confirmation page title',
    defaultMessage: 'Confirmation',
  });
  useTitle(pageTitle);

  return (
    <Card
      title={
        <FormattedMessage
          description="Checking background processing status title"
          defaultMessage="Processing..."
        />
      }
    >
      <Loader modifiers={['centered']} />
      <Body>
        <FormattedMessage
          description="Checking background processing status body"
          defaultMessage="Please hold on while we're processing your submission."
        />
      </Body>
    </Card>
  );
};

export default AppointmentConfirmation;
