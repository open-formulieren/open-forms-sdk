import {useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useAsync, useLocalStorage} from 'react-use';

import {ConfigContext} from 'Context';
import {apiCall} from 'api';
import useQuery from 'hooks/useQuery';

const useRecycleSubmission = (form, currentSubmission, onSubmissionLoaded, onError = () => {}) => {
  const location = useLocation();
  const config = useContext(ConfigContext);
  const queryParams = useQuery();

  // see open-formulieren/open-forms#5266 - when the user re-opens the tab/browser with
  // an initial data reference in the URL parameters, while there is still a submission
  // reference, this causes the (new) initial data reference to be ignored.
  const initialDataReference = queryParams.get('initial_data_reference');

  // XXX: use sessionStorage instead of localStorage for this, so that it's scoped to
  // a single tab/window?
  let [submissionId, setSubmissionId, removeSubmissionId] = useLocalStorage(form.uuid, '');

  // If no submissionID is in the localStorage see if one can be retrieved from the query param
  if (!submissionId) {
    submissionId = queryParams.get('submission_uuid');
  }

  // see open-formulieren/open-forms#5266 - if we have both an initial data reference
  // (extracted from the query parameters) and a submission ID, discard the submission ID. The
  // query parameter is passed along just long enough to be able to send it to the submission
  // create, after which it's "baked in" on the server side. The presence of this parameters
  // therefore implies that we should discard any existing submissions for the same form.
  if (initialDataReference && submissionId) {
    submissionId = undefined;
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
