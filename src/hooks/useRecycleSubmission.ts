import {useCallback, useContext} from 'react';
import {useSearchParams} from 'react-router';
import {useAsync, useSessionStorage} from 'react-use';

import {ConfigContext} from '@/Context';
import {apiCall} from '@/api';
import {type Form} from '@/data/forms';
import {type Submission} from '@/data/submissions';

import useInitialDataReference from './useInitialDataReference';

/** Recycle a submission. Checks if there is an existing submission for the current form present in
 * the session storage or the query parameters. If there is, we load this submission from the
 * backend. Note that a submission is never offered for re-use when an initial data reference is
 * present in the url.
 * @param  form               The current form.
 * @param  currentSubmission  The current submission.
 * @param  onSubmissionLoaded Callback executed on a submission load - takes the loaded submission as an argument.
 * @param  onError            Callback executed on a failed submission load - takes the error as an argument.
 * @return                    Array with: boolean that indicates whether the submission is being loaded,
 *                            and callbacks for setting and removing the submission to/from the session storage.
 */
const useRecycleSubmission = (
  form: Form,
  currentSubmission: Submission | null,
  onSubmissionLoaded: (submission: Submission) => void = () => {},
  onError: (error: Error) => void = () => {}
): [boolean, (value: string | null) => void, () => void] => {
  const config = useContext(ConfigContext);
  const [params] = useSearchParams();

  // see open-formulieren/open-forms#5266 - when the user re-opens the tab/browser with
  // an initial data reference in the URL parameters, while there is still a submission
  // reference, this causes the (new) initial data reference to be ignored.
  const {initialDataReference} = useInitialDataReference();

  const [stateSubmissionId, setSubmissionId] = useSessionStorage<string | null>(form.uuid, null);

  let submissionId = stateSubmissionId;
  const removeSubmissionId = useCallback(() => {
    // We remove the current submission by setting it to null
    setSubmissionId(null);
  }, [setSubmissionId]);

  // If no submissionID is in the session storage see if one can be retrieved from the query param
  if (!submissionId) {
    submissionId = params.get('submission_uuid');
  }

  // see open-formulieren/open-forms#5266 - if we have both an initial data reference
  // (extracted from the query parameters) and a submission ID, discard the submission ID. The
  // query parameter is passed along just long enough to be able to send it to the submission
  // create, after which it's "baked in" on the server side. The presence of this parameter
  // therefore implies that we should discard any existing submissions for the same form.
  if (initialDataReference && submissionId) {
    submissionId = null;
  }

  const url = submissionId ? `${config.baseUrl}submissions/${submissionId}` : null;

  // try to load the submission from the detail endpoint
  const {loading} = useAsync(async () => {
    // no URL to load -> abort
    if (!url) return;
    // the submission from the state is the same as the submission ID in session storage -> abort
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
      const submission = (await response.json()) as Submission;
      onSubmissionLoaded(submission);
      setSubmissionId(submission.id);
      return;
    }
  }, [url, submissionId, currentSubmission?.id]);

  return [loading, setSubmissionId, removeSubmissionId];
};

export default useRecycleSubmission;
