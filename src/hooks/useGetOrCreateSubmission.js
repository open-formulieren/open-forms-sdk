import {useContext, useEffect} from 'react';
import {useAsyncFn, useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {createSubmission, flagActiveSubmission, flagNoActiveSubmission} from 'data/submissions';

export const SESSION_STORAGE_KEY = 'appointment|submission';

const useGetOrCreateSubmission = form => {
  const {baseUrl} = useContext(ConfigContext);
  const [submission, setSubmission] = useSessionStorage(SESSION_STORAGE_KEY, null);

  const [state, callback] = useAsyncFn(
    async signal => {
      if (submission == null) {
        try {
          const submissionData = await createSubmission(baseUrl, form, signal);
          setSubmission(submissionData);
        } catch (e) {
          if (error.name !== 'AbortError') {
            throw e;
          }
        }
      }
      flagActiveSubmission();
    },
    [baseUrl, form, submission]
  );

  useEffect(() => {
    const abortController = new AbortController();
    callback(abortController.signal);
    return () => abortController.abort();
  }, [callback]);

  const {loading, error} = state;

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
