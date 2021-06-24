import {useState} from 'react';

import useTimeoutFn from "react-use/esm/useTimeoutFn";

import {get} from '../api';

/**
 * Hook to poll an API endpoint
 */
const usePoll = (url, timeout, callback) => {
  const [state, setState] = useState({
    loading: true,
    error: undefined,
  });

  const [, cancel, reset] = useTimeoutFn(
    async () => {
      const response = await get(url);

      // invoke the callback to process the response
      try {
        const done = callback(response);
        if (!done) {
          reset();
        } else {
          setState({
            loading: false,
            error: undefined,
          });
        }
      } catch (err) {
        cancel();
        setState({
          loading: false,
          error: err,
        });
      }
    },
    timeout
  );

  return state;
};


export default usePoll;
