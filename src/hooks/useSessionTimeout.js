import {useCallback, useEffect, useState} from 'react';
import {useGlobalState} from 'state-pool';

import {sessionExpiresAt} from 'api';


const useSessionTimeout = (onTimeout) => {
  const [expired, setExpired] = useState(false);
  const [expiryDate, setExpiryDate] = useGlobalState(sessionExpiresAt);

  const markExpired = useCallback(() => {
    onTimeout && onTimeout();
    setExpired(true);
  }, [onTimeout]);

  useEffect(() => {
    let mounted = true;
    if (expiryDate == null) return;

    const expiryInMs = expiryDate - (new Date());

    // fun one! admin sessions can span multiple days, so if the expiry is in the far future
    // (> 1 day), don't even bother with checking/marking things as expired. It's not relevant.
    // If we do allow large values, there's a risk we exceed the max value for a 32 bit number,
    // leading to overflows in setTimeout and immediately marking the session as expired
    // as a consequence.
    if (expiryInMs > 1000 * 60 * 60 * 24) return;

    // don't schedule the expiry-setter (which leads to state updates and re-renders)
    // if the session is already expired.
    if (expired) return;

    if (expiryInMs <= 0) {
      markExpired();
      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        if (!mounted) return;
        markExpired();
      },
      expiryInMs - 500,  // be a bit pro-active
    );

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [expired, expiryDate, markExpired]);

  const reset = () => {
    setExpired(false);
    setExpiryDate(null);
  }

  return [expired, expiryDate, reset];
};

export default useSessionTimeout;
