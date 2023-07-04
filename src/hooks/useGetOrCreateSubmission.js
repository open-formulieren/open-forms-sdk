import {useContext} from 'react';
import {useAsync, useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {post} from 'api';

const SESSION_STORAGE_KEY = 'appointment|submission';

const useGetOrCreateSubmission = () => {
  const {baseUrl} = useContext(ConfigContext);
  const [submission, setSubmission] = useSessionStorage(SESSION_STORAGE_KEY, null);

  const {loading, error} = useAsync(async () => {
    if (submission !== null) return;
    const response = await post(`${baseUrl}submissions`);
    setSubmission(response.data);
  }, [baseUrl, submission]);

  return {
    isLoading: loading,
    error,
    submission,
    removeSubmissionFromStorage: () => window.sessionStorage.removeItem(SESSION_STORAGE_KEY),
  };
};

export default useGetOrCreateSubmission;
