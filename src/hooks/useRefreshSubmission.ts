import {useAsync} from 'react-use';

import {get} from '@/api';
import {logError} from '@/components/Errors';
import type {Submission} from '@/data/submissions';

/**
 * Hook that refreshes the submission instance from the backend
 * @param  submission The submission object to refresh
 * @return            The refreshed submission or current submission while loading.
 */
const useRefreshSubmission = (submission: Submission): Submission => {
  const {
    loading,
    value = submission,
    error,
  } = useAsync(async () => (await get<Submission>(submission.url))!);
  if (error) logError(error);
  return loading ? submission : value;
};

export default useRefreshSubmission;
