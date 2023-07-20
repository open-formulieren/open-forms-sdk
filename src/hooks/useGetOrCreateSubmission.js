import {useContext, useEffect} from 'react';
import {useAsyncFn, useSessionStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {createSubmission, flagActiveSubmission, flagNoActiveSubmission} from 'data/submissions';

export const SESSION_STORAGE_KEY = 'appointment|submission';

const useGetOrCreateSubmission = (form, skipCreation) => {
  const {baseUrl} = useContext(ConfigContext);
  const [submission, setSubmission] = useSessionStorage(SESSION_STORAGE_KEY, null);

  const clear = () => {
    setSubmission(null);
    flagNoActiveSubmission();
  };

  // do nothing when there is no submission and the creation must be skipped
  const hasSubmission = submission !== null;
  const shouldCreate = !hasSubmission && !skipCreation;

  const [state, callback] = useAsyncFn(
    async signal => {
      if (shouldCreate) {
        try {
          setSubmission(await createSubmission(baseUrl, form, signal));
        } catch (e) {
          if (error.name !== 'AbortError') {
            throw e;
          }
        }
      }

      // there either was a submission or it was just created -> flag that we have an
      // active submission
      if (hasSubmission || shouldCreate) {
        flagActiveSubmission();
      }
    },
    [baseUrl, hasSubmission, shouldCreate, form]
  );

  // Ensure pending requests are cancelled when the component unmounts.
  useEffect(() => {
    const abortController = new AbortController();
    callback(abortController.signal);
    return () => abortController.abort();
  }, [callback]);

  const {loading, error} = state;

  // the useAsyncFn goes into 'loading' state whenever the callback is running, even
  // if there is nothing to do, so we should properly reflect that in our own derived
  // isLoading
  const isDoingWork = shouldCreate && loading;
  return {isLoading: isDoingWork, error, submission, clear};
};

export default useGetOrCreateSubmission;
