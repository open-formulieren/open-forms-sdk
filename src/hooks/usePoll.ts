import {useState} from 'react';
import {useTimeoutFn} from 'react-use';

import {get} from '../api';

type UsePollState<T> =
  | {
      loading: true;
      error: undefined;
      response: null;
    }
  | {
      loading: false;
      error: Error;
      response: null;
    }
  | {
      loading: false;
      error: undefined;
      response: T;
    };

/**
 * Hook to poll an API endpoint
 */
const usePoll = <T = unknown>(
  url: string,
  timeout: number,
  doneCheck: (response: T) => boolean,
  onDone: (response: T) => void | Promise<void>
): UsePollState<T> => {
  const [state, setState] = useState<UsePollState<T>>({
    loading: true,
    error: undefined,
    response: null,
  });

  const fn = async () => {
    try {
      const response = (await get<T>(url))!;
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
