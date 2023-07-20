import {rest} from 'msw';

import {BASE_URL, getDefaultFactory} from './base';

// FIXME - this is incomplete, the prop types aren't detailed enough.
const SUBMISSION_DETAILS = {
  id: '458b29ae-5baa-4132-a0d7-8c7071b8152a',
  url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a`,
  form: `${BASE_URL}forms/mock`,
  steps: [
    {
      id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
      name: 'Step 1',
      url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      formStep: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      isApplicable: true,
      completed: false,
      canSubmit: true,
    },
  ],
  submissionAllowed: 'yes',
  isAuthenticated: false,
  payment: {
    isRequired: false,
    amount: undefined,
    hasPaid: false,
  },
};

/**
 * Return a submission object as if it would be returned from the backend API.
 * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
 *                            are deep-assigned via lodash.set to the defaults, so use
 *                            '.'-joined strings as keys for deep paths.
 * @return {Object}           A submission object.
 */
export const buildSubmission = getDefaultFactory(SUBMISSION_DETAILS);

export const mockSubmissionPost = (submission = buildSubmission()) =>
  rest.post(`${BASE_URL}submissions`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(submission));
  });

/**
 * Simulate a succesful backend processing status without payment.
 */
export const mockSubmissionProcessingStatusGet = rest.get(
  `${BASE_URL}submissions/:uuid/:token/status`,
  (req, res, ctx) =>
    res(
      ctx.json({
        status: 'done',
        result: 'success',
        errorMessage: '',
        publicReference: 'OF-L337',
        confirmationPageContent: `<p>Thank you for doing <span style="font-style: italic;">the thing</span>.`,
        reportDownloadUrl: '#',
        paymentUrl: '',
        mainWebsiteUrl: '#',
      })
    )
);
