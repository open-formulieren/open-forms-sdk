import React from 'react';
import {useGlobalState} from 'state-pool';
import {FormattedRelativeTime, FormattedMessage} from 'react-intl';

import {sessionExpiresAt} from 'api';


const SessionExpiry = () => {
  const [expiryDate] = useGlobalState(sessionExpiresAt);
  if (!expiryDate) return null;

  const seconds = (expiryDate - new Date()) / 1000;
  const delta = (
    <FormattedRelativeTime value={seconds} numeric="auto" updateIntervalInSeconds={1} />
  );
  return (
    <FormattedMessage
      description="Session expiry timer"
      defaultMessage="Your session will expire {delta}"
      values={{delta: delta}}
    />
  );
};

SessionExpiry.propTypes = {
};


export default SessionExpiry;
