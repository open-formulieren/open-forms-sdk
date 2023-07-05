import {createSubmission} from 'data/submissions';
import {useContext} from 'react';
import {useAsync, useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';

export const SESSION_STORAGE_KEY = 'appointment|submission';

const useGetOrCreateSubmission = form => {
  const {baseUrl} = useContext(ConfigContext);
  const [submission, setSubmission] = useSessionStorage(SESSION_STORAGE_KEY, null);

  const {loading, error} = useAsync(async () => {
    if (submission !== null) return;
    const response = await createSubmission(baseUrl, form);
    setSubmission(response.data);
  }, [baseUrl, form, submission]);

  return {
    isLoading: loading,
    error,
    submission,
    removeSubmissionFromStorage: () => window.sessionStorage.removeItem(SESSION_STORAGE_KEY),
  };
};

export default useGetOrCreateSubmission;
