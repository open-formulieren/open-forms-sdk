import {ButtonGroup} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {FormattedMessage, FormattedRelativeTime} from 'react-intl';
import {useTimeout, useTimeoutFn} from 'react-use';

import {ConfigContext} from 'Context';
import {apiCall} from 'api';
import {OFButton} from 'components/Button';
import ErrorMessage from 'components/Errors/ErrorMessage';
import Modal from 'components/modals/Modal';
import useSessionTimeout from 'hooks/useSessionTimeout';

const WARN_SESSION_TIMEOUT_FACTOR = 0.9; // once 90% of the session expiry time has passed, show a warning
const TEN_HOURS_MS = 10 * 3600 * 1000; // ten hours in miliseconds

const RelativeTimeToExpiry = ({numSeconds}) => {
  // more than 24 hours -> don't bother
  if (numSeconds >= 3600 * 24) return null;
  return <FormattedRelativeTime value={numSeconds} numeric="auto" updateIntervalInSeconds={1} />;
};

RelativeTimeToExpiry.propTypes = {
  numSeconds: PropTypes.number.isRequired,
};

const useTriggerWarning = ms => {
  let timeout;

  const [showWarning, setShowWarning] = useState(false);

  // no time available
  if (ms == null) {
    timeout = TEN_HOURS_MS; // 10 hours as a fallback
  } else {
    // re-render WARN_SESSION_TIMEOUT_FACTOR before the session expires to show a warning
    timeout = WARN_SESSION_TIMEOUT_FACTOR * ms;
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

const SessionTrackerModal = ({expiryDate = null, onTimeout, children}) => {
  // support grabbing the expiry date from the hook instead of the prop
  const [, hookExpiryDate] = useSessionTimeout(onTimeout);
  if (expiryDate == null) {
    expiryDate = hookExpiryDate;
  }

  const [warningDismissed, setWarningDismissed] = useState(false);

  // re-render when the session is expired to show the error message
  const now = new Date();
  const _timeToExpiryInMS = expiryDate ? Math.max(expiryDate - now, 0) : TEN_HOURS_MS; // 10 hour fallback in case there's no date
  // Limit to max 10 hours, because funny things happen once you go > 25 days where the
  // callback executes immediately which results in infinite render loops. Shouldn't
  // matter for prod environments where session timeouts are typically < 1 hour, but in
  // dev this can easily lead to a frozen browser.
  const timeToExpiryInMS = Math.min(_timeToExpiryInMS, TEN_HOURS_MS);
  const [, cancelExpiryTimeout, resetExpiryTimeout] = useTimeout(timeToExpiryInMS);
  const [warningTriggered, resetWarningTriggered] = useTriggerWarning(timeToExpiryInMS);

  // reset if a new timeout date is received
  useEffect(() => {
    if (!expiryDate) {
      cancelExpiryTimeout();
    } else {
      resetExpiryTimeout();
      resetWarningTriggered();
      setWarningDismissed(false);
    }
    return () => {
      cancelExpiryTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryDate]);

  const showWarning = !warningDismissed && warningTriggered;
  const secondsToExpiry = parseInt((expiryDate - now) / 1000);
  // ensure that the components don't get unmounted when there's no expiryDate -> do not
  // exit early
  return (
    <>
      {expiryDate && (
        <ExpiryModal
          showWarning={showWarning}
          secondsToExpiry={secondsToExpiry}
          setWarningDismissed={setWarningDismissed}
        />
      )}
      {children}
    </>
  );
};

SessionTrackerModal.propTypes = {
  expiryDate: PropTypes.instanceOf(Date),
  onTimeout: PropTypes.func,
  children: PropTypes.node,
};

const ExpiryModal = ({showWarning, secondsToExpiry, setWarningDismissed}) => {
  const {baseUrl} = useContext(ConfigContext);
  return (
    <Modal
      title={
        <FormattedMessage
          description="Session expiry warning title (in modal)"
          defaultMessage="Your session will expire soon."
        />
      }
      isOpen={showWarning}
      closeModal={() => {
        setWarningDismissed(true);
      }}
    >
      <ErrorMessage modifier="warning">
        <FormattedMessage
          description="Session expiry warning message (in modal)"
          defaultMessage="Your session is about to expire {delta}. Extend your session if you wish to continue."
          values={{
            delta: <RelativeTimeToExpiry numSeconds={secondsToExpiry} />,
          }}
        />
      </ErrorMessage>
      <ButtonGroup direction="column">
        <OFButton
          type="submit"
          appearance="primary-action-button"
          onClick={async event => {
            event.preventDefault();
            await apiCall(`${baseUrl}ping`);
          }}
        >
          <FormattedMessage
            description="Extend session button (in modal)"
            defaultMessage="Extend"
          />
        </OFButton>
      </ButtonGroup>
    </Modal>
  );
};

ExpiryModal.propTypes = {
  showWarning: PropTypes.bool.isRequired,
  secondsToExpiry: PropTypes.number.isRequired,
  setWarningDismissed: PropTypes.func.isRequired,
};

export default SessionTrackerModal;
