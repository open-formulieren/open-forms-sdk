import {useCallback, useRef} from 'react';

/**
 * Creates a throttled function that invokes `callback` once every `wait` milliseconds.
 *
 * The invokes only happen on active usage, when the timer runs out but the hook is not
 * being used, the callback will NOT be invoked.
 *
 * @param callback The callback method to invoke.
 * @param wait Amount of time between invokes in milliseconds.
 */
export const useThrottledCallback = (callback: () => void, wait: number) => {
  const lastInvoke = useRef<number>(0);

  return useCallback(() => {
    const timeSinceLastInvoke = Date.now() - lastInvoke.current;
    const timeUntilNextInvoke = wait - timeSinceLastInvoke;

    // In case there hasn't been a previous invoke yet, or the last invoke was more than
    // `wait` milliseconds ago, we trigger the callback.
    const shouldInvoke = timeUntilNextInvoke < 0;
    if (shouldInvoke) {
      lastInvoke.current = Date.now();
      callback();
    }
  }, [callback, wait]);
};
