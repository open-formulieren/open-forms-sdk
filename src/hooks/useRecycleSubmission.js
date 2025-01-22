import {useContext} from 'react';
import {useLocation, useSearchParams} from 'react-router';
import {useAsync, useLocalStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {apiCall} from 'api';

const useRecycleSubmission = (form, currentSubmission, onSubmissionLoaded, onError = () => {}) => {
  const location = useLocation();
  const config = useContext(ConfigContext);
  const [params] = useSearchParams();
  // XXX: use sessionStorage instead of localStorage for this, so that it's scoped to
  // a single tab/window?
  let [submissionId, setSubmissionId, removeSubmissionId] = useLocalStorage(form.uuid, '');

  // If no submissionID is in the localStorage see if one can be retrieved from the query param
  if (!submissionId) {
    submissionId = params.get('submission_uuid');
  }

  const url = submissionId ? `${config.baseUrl}submissions/${submissionId}` : null;

  // try to load the submission from the detail endpoint
  const {loading} = useAsync(async () => {
    // no URL to load -> abort
    if (!url) return;
    // the submission from the state is the same as the submission ID in local storage -> abort
    if (currentSubmission?.id === submissionId) return;

    // fetch the submission from the API
    let response;
    try {
      response = await apiCall(url, {});
    } catch (e) {
      if ([403, 404, 422].includes(e.statusCode)) {
        removeSubmissionId();
        onError(e);
        return;
      }
      onError(e);
      return;
    }
    if (response.ok) {
      const submission = await response.json();
      onSubmissionLoaded(submission, location);
      setSubmissionId(submission.id);
      return;
    }
  }, [url, submissionId, currentSubmission?.id]);

  return [loading, setSubmissionId, removeSubmissionId];
};

export default useRecycleSubmission;
