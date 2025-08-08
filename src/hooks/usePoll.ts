import {useState} from 'react';
import {useTimeoutFn} from 'react-use';

import {get} from '@/api';
import type {AnyError} from '@/components/Errors/types';
import type {SubmissionProcessingStatus} from '@/data/submission-status';

interface PollReturnProps {
  loading: boolean;
  error?: AnyError;
  response: SubmissionProcessingStatus | null;
}

/**
 * Hook to poll an API endpoint
 */
const usePoll = (
  url: string,
  timeout: number,
  doneCheck: (response: SubmissionProcessingStatus) => boolean,
  onDone: (response: SubmissionProcessingStatus) => void
): PollReturnProps => {
  const [state, setState] = useState<PollReturnProps>({
    loading: true,
    error: undefined,
    response: null,
  });

  const fn = async () => {
    try {
      const response = await get<SubmissionProcessingStatus>(url);
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
