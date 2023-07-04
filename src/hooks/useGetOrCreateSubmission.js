import {useContext} from 'react';
import {useAsync, useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {createSubmission, flagActiveSubmission, flagNoActiveSubmission} from 'data/submissions';

export const SESSION_STORAGE_KEY = 'appointment|submission';

const useGetOrCreateSubmission = form => {
  const {baseUrl} = useContext(ConfigContext);
  const [submission, setSubmission] = useSessionStorage(SESSION_STORAGE_KEY, null);

  const {loading, error} = useAsync(async () => {
    if (submission === null) {
      const response = await createSubmission(baseUrl, form);
      setSubmission(response.data);
    }
    flagActiveSubmission();
  }, [baseUrl, form, submission]);

  return {
    isLoading: loading,
    error,
    submission,
    removeSubmissionFromStorage: () => {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      flagNoActiveSubmission();
    },
  };
};

export default useGetOrCreateSubmission;
