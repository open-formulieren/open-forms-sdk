import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FormattedMessage, FormattedRelativeTime} from 'react-intl';
import useTimeout from 'react-use/esm/useTimeout';
import useTimeoutFn from 'react-use/esm/useTimeoutFn';

import {apiCall} from 'api';
import Anchor from 'components/Anchor';
import Card from 'components/Card';
import ErrorMessage from 'components/ErrorMessage';
import Modal from 'components/modals/Modal';
import {Toolbar, ToolbarList} from 'components/Toolbar';
import Button from 'components/Button';
import {ConfigContext} from 'Context';

const WARN_SESSION_TIMEOUT_FACTOR = 0.9; // once 90% of the session expiry time has passed, show a warning

const RelativeTimeToExpiry = ({numSeconds}) => {
  // more than 24 hours -> don't bother
  if (numSeconds >= 3600 * 24) return null;
  return (
    <FormattedRelativeTime value={numSeconds} numeric="auto" updateIntervalInSeconds={1} />
  );
};

RelativeTimeToExpiry.propTypes = {
  numSeconds: PropTypes.number.isRequired,
};

const useTriggerWarning = (numSeconds) => {
  let timeout;

  const [showWarning, setShowWarning] = useState(false);

  // no time available
  if (numSeconds == null) {
    timeout = 10 * 3600 * 1000; // 10 hours as a fallback
  } else {
    // re-render WARN_SESSION_TIMEOUT_FACTOR before the session expires to show a warning
    timeout = WARN_SESSION_TIMEOUT_FACTOR * numSeconds * 1000;
  }
  const reset = useTimeoutFn(() => setShowWarning(true), timeout)[2];
  return [
    showWarning,
    () => {
      setShowWarning(false);
      reset();
    },
  ];
};

const RequireSession = ({expired = false, expiryDate = null, children}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [warningDismissed, setWarningDismissed] = useState(false);

  // re-render when the session is expired to show the error message
  const now = new Date();
  const timeToExpiryInMS = expiryDate ? Math.max(expiryDate - now, 0) : 1000 * 3600 * 10; // 10 hour fallback in case there's no date
  const [, cancelExpiryTimeout, resetExpiryTimeout] = useTimeout(timeToExpiryInMS);
  const [warningTriggered, resetWarningTriggered] = useTriggerWarning(timeToExpiryInMS / 1000);

  // reset if a new timeout date is received
  useEffect(() => {
    if (!expiryDate) {
      cancelExpiryTimeout();
      return;
    }
    resetExpiryTimeout();
    resetWarningTriggered();
    setWarningDismissed(false);
    return () => {
      cancelExpiryTimeout();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryDate]);

  if (expired) {
    return (
      <Card
        title={<FormattedMessage description="Session expired card title" defaultMessage="Your session has expired"/>}>
        <ErrorMessage>
          <FormattedMessage
            description="Session expired error message"
            defaultMessage="Your session has expired. Click <link>here</link> to restart."
            values={{
              link: chunks => <Link to="/" component={Anchor}>{chunks}</Link>,
            }}
          />
        </ErrorMessage>
      </Card>
    );
  }

  // if we don't have any expiry date information, we can't show anything -> abort early.
  if (expiryDate == null) return children;

  const showWarning = !warningDismissed && warningTriggered;
  const secondsToExpiry = parseInt((expiryDate - now) / 1000);
  return (
    <>
      <Modal
        title={
          <FormattedMessage
            description="Session expiry warning title (in modal)"
            defaultMessage="Your session will expire soon."
          />}
        isOpen={showWarning}
        closeModal={() => {
          setWarningDismissed(true);
        }}
      >
        <ErrorMessage modifiers={['warning']}>
          <FormattedMessage
            description="Session expiry warning message (in modal)"
            defaultMessage="Your session is about to expire {delta}. Extend your session if you wish to continue."
            values={{
              delta: <RelativeTimeToExpiry numSeconds={secondsToExpiry} />,
            }}/>
        </ErrorMessage>
        <Toolbar modifiers={['bottom', 'reverse']}>
          <ToolbarList>
            <Button type="submit" variant="primary" onClick={async (event) => {
              event.preventDefault();
              await apiCall(`${baseUrl}ping`);
            }}>
              <FormattedMessage description="Extend session button (in modal)" defaultMessage="Extend" />
            </Button>
          </ToolbarList>
        </Toolbar>
      </Modal>
      {children}
    </>
  )
};

RequireSession.propTypes = {
  expired: PropTypes.bool,
  expiryDate: PropTypes.instanceOf(Date),
  children: PropTypes.node,
};


export default RequireSession;
