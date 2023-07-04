import {post} from 'api';

/**
 * Create a submission instance from a given form instance
 * @param  {String} baseUrl The Open Forms backend baseUrl of the API (e.g. https://example.com/api/v2/)
 * @param  {Object} form   The relevant Open Forms form instance.
 * @return {Object}        The Submission instance.
 */
export const createSubmission = async (baseUrl, form) => {
  const createData = {
    form: form.url,
    formUrl: window.location.toString(),
  };
  const submissionResponse = await post(`${baseUrl}submissions`, createData);
  return submissionResponse.data;
};
