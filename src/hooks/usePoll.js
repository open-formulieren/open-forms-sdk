import {useState} from 'react';
import {useTimeoutFn} from 'react-use';

import {get} from '../api';

/**
 * Hook to poll an API endpoint
 */
const usePoll = (url, timeout, doneCheck, onDone) => {
  const [state, setState] = useState({
    loading: true,
    error: undefined,
    response: null,
  });

  const fn = async () => {
    try {
      const response = await get(url);
      const isDone = doneCheck(response);
      if (isDone) {
        setState({loading: false, error: undefined, response});
        onDone(response);
      } else {
        reset();
      }
    } catch (err) {
      setState({loading: false, error: err, response: null});
    }
  };

  const [, , reset] = useTimeoutFn(fn, timeout);

  return state;
};

export default usePoll;
