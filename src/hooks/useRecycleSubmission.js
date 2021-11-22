import {useContext} from 'react';

import {useLocation} from 'react-router-dom';
import useLocalStorage from 'react-use/esm/useLocalStorage';
import useAsync from 'react-use/esm/useAsync';

import {apiCall} from 'api';
import {ConfigContext} from 'Context';
import useQuery from 'hooks/useQuery';

const useRecycleSubmission = (form, currentSubmission, onSubmissionLoaded) => {
  const location = useLocation();
  const config = useContext(ConfigContext);
  const queryParams = useQuery();
  let [submissionId, setSubmissionId, removeSubmissionId] = useLocalStorage(form.uuid, '');

  // If no submissionID is in the localStorage see if one can be retrieved from the query param
  if (!submissionId) {
      submissionId = queryParams.get('submission_uuid');
  }

  const url = submissionId ? `${config.baseUrl}submissions/${submissionId}` : null;

  // try to load the submission from the detail endpoint
  const {loading} = useAsync(
    async () => {
      // no URL to load -> abort
      if (!url) return;
      // the submission from the state is the same as the submission ID in local storage -> abort
      if (currentSubmission?.id === submissionId) return;

      // fetch the submission from the API
      const response = await apiCall(url, {});
      if (response.ok) {
        const submission = await response.json();
        onSubmissionLoaded(submission, location);
        setSubmissionId(submission.id);
        return;
      }

      // error handling
      if (response.status === 403 || response.status === 404) {
        removeSubmissionId();
      }
      return;
    },
    [url, submissionId, currentSubmission?.id],
  );

  return [
    loading,
    setSubmissionId,
    removeSubmissionId
  ];
};


export default useRecycleSubmission;
