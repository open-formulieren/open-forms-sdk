import {createState} from 'state-pool';

import {post} from 'api';

/**
 * Create a submission instance from a given form instance
 * @param  {String} baseUrl The Open Forms backend baseUrl of the API (e.g. https://example.com/api/v2/)
 * @param  {Object} form   The relevant Open Forms form instance.
 * @param  {String} formUrl The client-side URL hosting the form entrypoint.
 * @param  {String} initialDataReference The data reference provided by the external party.
 * @return {Object}        The Submission instance.
 */
export const createSubmission = async (
  baseUrl,
  form,
  formUrl,
  signal,
  initialDataReference,
  anonymous = false
) => {
  const createData = {
    form: form.url,
    formUrl,
    anonymous,
  };

  if (initialDataReference) {
    createData['initialDataReference'] = initialDataReference;
  }

  const submissionResponse = await post(`${baseUrl}submissions`, createData, signal);
  return submissionResponse.data;
};

export const globalSubmissionState = createState({hasSubmission: false});

export const flagActiveSubmission = () => {
  globalSubmissionState.updateValue(state => {
    state.hasSubmission = true;
  });
};

export const flagNoActiveSubmission = () => {
  globalSubmissionState.updateValue(state => {
    state.hasSubmission = false;
  });
};
