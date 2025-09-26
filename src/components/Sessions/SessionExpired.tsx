import {useContext, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';

import useSessionTimeout from 'hooks/useSessionTimeout';

import {ConfigContext} from '@/Context';
import AppDebug from '@/components/AppDebug';
import Card from '@/components/Card';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import Link from '@/components/Link';
import {flagNoActiveSubmission} from '@/data/submissions';

const SessionExpired: React.FC = () => {
  const config = useContext(ConfigContext);
  const [expired, expiryDate, reset] = useSessionTimeout();

  /* istanbul ignore next */
  if (!config.debug && !expired) {
    throw new Error("The session isn't expired");
  }

  useEffect(() => {
    flagNoActiveSubmission();
    window.localStorage.clear();
    window.sessionStorage.clear();
    if (expiryDate !== null) reset();
  });

  return (
    <>
      <Card
        title={
          <FormattedMessage
            description="Session expired card title"
            defaultMessage="Your session has expired"
          />
        }
      >
        <ErrorMessage>
          <FormattedMessage
            description="Session expired error message"
            defaultMessage="Your session has expired. <link>Click here to restart</link>."
            values={{
              link: chunks => <Link to="/">{chunks}</Link>,
            }}
          />
        </ErrorMessage>
      </Card>
      {config.debug && <AppDebug />}
    </>
  );
};

export default SessionExpired;
