import {useAsync} from 'react-use';

import { get } from 'api';

/**
 * Hook that refreshes the submission instance from the backend
 * @param  {Object} submission The submission object to refresh
 * @return {Object}            The refreshed submission or current submission while loading.
 */
const useRefreshSubmission = (submission) => {
  const {loading, value, error} = useAsync(
    async () => {
      const refreshedSubmission = get(submission.url);
      return refreshedSubmission;
    }
  );
  if (error) {
    console.error(error);
  }
  return loading ? submission : value;
};

export default useRefreshSubmission;
