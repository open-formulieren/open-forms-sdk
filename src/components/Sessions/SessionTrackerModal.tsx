import {Modal, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {ButtonGroup} from '@utrecht/button-group-react';
import {useContext, useEffect, useState} from 'react';
import {FormattedMessage, FormattedRelativeTime} from 'react-intl';
import {useTimeout, useTimeoutFn} from 'react-use';

import {ConfigContext} from '@/Context';
import {apiCall} from '@/api';
import ErrorMessage from '@/components/Errors/ErrorMessage';
import useSessionTimeout from '@/hooks/useSessionTimeout';

const WARN_SESSION_TIMEOUT_FACTOR: number = 0.9; // once 90% of the session expiry time has passed, show a warning
const TEN_HOURS_MS: number = 10 * 3600 * 1000; // ten hours in miliseconds

interface RelativeTimeToExpiryProps {
  numSeconds: number;
}

const RelativeTimeToExpiry: React.FC<RelativeTimeToExpiryProps> = ({numSeconds}) => {
  // more than 24 hours -> don't bother
  if (numSeconds >= 3600 * 24) return null;
  return <FormattedRelativeTime value={numSeconds} numeric="auto" updateIntervalInSeconds={1} />;
};

type UseTriggerWarning = [boolean, () => void];

const useTriggerWarning = (ms: number): UseTriggerWarning => {
  const [showWarning, setShowWarning] = useState(false);
  // re-render WARN_SESSION_TIMEOUT_FACTOR before the session expires to show a warning
  const timeout = WARN_SESSION_TIMEOUT_FACTOR * ms;
  const reset = useTimeoutFn(() => setShowWarning(true), timeout)[2];
  return [
    showWarning,
    () => {
      setShowWarning(false);
      reset();
    },
  ];
};

export interface SessionTrackerModalProps {
  expiryDate?: Date | null;
  onTimeout?: () => void;
  children: React.ReactNode;
}

const SessionTrackerModal: React.FC<SessionTrackerModalProps> = ({
  expiryDate = null,
  onTimeout,
  children,
}) => {
  // support grabbing the expiry date from the hook instead of the prop
  const [, hookExpiryDate] = useSessionTimeout(onTimeout);
  if (expiryDate == null) {
    expiryDate = hookExpiryDate;
  }

  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);

  // re-render when the session is expired to show the error message
  const now = new Date();
  const _timeToExpiryInMS = expiryDate
    ? Math.max(Number(expiryDate) - Number(now), 0)
    : TEN_HOURS_MS; // 10 hour fallback in case there's no date
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
  const secondsToExpiry = Math.floor(timeToExpiryInMS / 1000);
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

export interface ExpiryModalProps {
  showWarning: boolean;
  secondsToExpiry: number;
  setWarningDismissed: (state: boolean) => void;
}

const ExpiryModal: React.FC<ExpiryModalProps> = ({
  showWarning,
  secondsToExpiry,
  setWarningDismissed,
}) => {
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
      <ErrorMessage level="warning">
        <FormattedMessage
          description="Session expiry warning message (in modal)"
          defaultMessage="Your session is about to expire {delta}. Extend your session if you wish to continue."
          values={{
            delta: <RelativeTimeToExpiry numSeconds={secondsToExpiry} />,
          }}
        />
      </ErrorMessage>
      <ButtonGroup direction="column">
        <PrimaryActionButton
          type="submit"
          onClick={async event => {
            event.preventDefault();
            await apiCall(`${baseUrl}ping`);
          }}
        >
          <FormattedMessage
            description="Extend session button (in modal)"
            defaultMessage="Extend"
          />
        </PrimaryActionButton>
      </ButtonGroup>
    </Modal>
  );
};

export default SessionTrackerModal;
