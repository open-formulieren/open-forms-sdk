import {useCallback, useEffect} from 'react';
import {useMatch, useNavigate} from 'react-router';
import {useUpdate} from 'react-use';
import {useState as useGlobalState} from 'state-pool';

import {sessionExpiresAt} from 'api';

type ResetCallback = () => void;

type UseSessionTimeout = [boolean, Date | null, ResetCallback];

const useSessionTimeout = (onTimeout?: () => void): UseSessionTimeout => {
  const [expiresAt, setExpiryDate] = useGlobalState(sessionExpiresAt);
  const navigate = useNavigate();
  const update = useUpdate();
  const expiryDate = expiresAt?.expiry;

  const expiryInMs = expiryDate != null ? Number(expiryDate) - Number(new Date()) : 0;
  const expired = expiryInMs <= 0;

  const sessionMatch = useMatch('/sessie-verlopen');

  const handleExpired = useCallback(() => {
    onTimeout?.();
    if (!sessionMatch) navigate('/sessie-verlopen');
  }, [onTimeout, navigate, sessionMatch]);

  useEffect(() => {
    let mounted = true;
    if (expiryDate == null) return;

    // fun one! admin sessions can span multiple days, so if the expiry is in the far future
    // (> 1 day), don't even bother with checking/marking things as expired. It's not relevant.
    // If we do allow large values, there's a risk we exceed the max value for a 32 bit number,
    // leading to overflows in setTimeout and immediately marking the session as expired
    // as a consequence.
    if (expiryInMs > 1000 * 60 * 60 * 24) return;

    if (expired) {
      handleExpired();
      return;
    }

    // at this point, we have not expired and there is an expiry soon-ish in the future.
    // schedule a re-render at the expected expiry time, which will flip the 'expired'
    // state from false to true and result in the expiry handler being called.
    // Note that the timeouts used are not exact, so they could arrive slightly earlier
    // or later - this is okay:
    // * if they arrive later, the expiry will definitely be a given
    // * if they arrive sooner, there is no expiry yet, but a new re-render will be
    //   scheduled very soon, which brings us into the previous case again.
    const timeoutId = window.setTimeout(() => {
      if (!mounted) return;
      update();
    }, expiryInMs + 5);

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [expired, expiryInMs, expiryDate, handleExpired, update]);

  const reset = () => {
    setExpiryDate({expiry: null});
  };

  return [expired, expiryDate, reset];
};

export default useSessionTimeout;
