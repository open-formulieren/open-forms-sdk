import type {AnyComponentSchema, JSONObject} from '@open-formulieren/types';
import {HttpResponse, http} from 'msw';

import type {SubmissionStep} from '@/data/submission-steps';
import type {Submission} from '@/data/submissions';
import type {InvalidParam} from '@/errors';
import {sleep} from '@/utils';

import {BASE_URL, getDefaultFactory} from './base';

const SUBMISSION_DETAILS = {
  id: '458b29ae-5baa-4132-a0d7-8c7071b8152a',
  url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a`,
  form: `${BASE_URL}forms/mock`,
  formUrl: 'http://localhost:3000/mock',
  initialDataReference: '',
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
    {
      id: 'a0ff2cfe-e59a-4881-88de-e1b0a76af8d3',
      name: 'Step 2',
      url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
      formStep: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
      isApplicable: false,
      completed: false,
      canSubmit: false,
    },
  ],
  submissionAllowed: 'yes',
  isAuthenticated: false,
  payment: {
    isRequired: false,
    amount: null,
    hasPaid: false,
  },
} satisfies Submission;

// mock for /api/v2/submissions/{submission_uuid}/steps/{step_uuid}
const SUBMISSION_STEP_DETAILS = {
  id: '58aad9c3-29c7-4568-9047-3ac7ceb0f0ff',
  slug: 'step-1',
  formStep: {
    index: 0,
    configuration: {
      components: [
        {
          id: 'asdiwj',
          type: 'textfield',
          key: 'component1',
          label: 'Component 1',
        },
      ],
    },
  },
  data: null,
  isApplicable: true,
  completed: false,
  canSubmit: true,
} satisfies SubmissionStep;

/**
 * Return a submission object as if it would be returned from the backend API.
 *
 * @param  overrides Key-value mapping with overrides from the defaults. These
 *                   are deep-assigned via lodash.set to the defaults, so use
 *                   '.'-joined strings as keys for deep paths.
 */
export const buildSubmission = getDefaultFactory<Submission>(SUBMISSION_DETAILS);

export const mockSubmissionPost = (submission = buildSubmission()) =>
  http.post(`${BASE_URL}submissions`, () => {
    return HttpResponse.json(submission, {status: 201});
  });

export const mockSubmissionGet = (submission = buildSubmission()) =>
  http.get(`${BASE_URL}submissions/:uuid`, () => {
    return HttpResponse.json(submission, {status: 200});
  });

interface BuildSubmissionStepOpts {
  components?: AnyComponentSchema[];
  data?: JSONObject | null;
  canSubmit?: boolean;
}

/**
 * Return a submission step object as if it would be returned from the backend API.
 */
export const buildSubmissionStep = ({
  components = SUBMISSION_STEP_DETAILS.formStep.configuration.components,
  data = null,
  canSubmit = true,
}: BuildSubmissionStepOpts): SubmissionStep => {
  const formioConfiguration: SubmissionStep['formStep']['configuration'] = {
    type: 'form',
    components,
  };
  return {
    id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
    slug: 'step-1',
    formStep: {index: 0, configuration: formioConfiguration},
    data: data,
    isApplicable: true,
    completed: false,
    canSubmit,
  } satisfies SubmissionStep;
};

export const mockSubmissionStepGet = (stepDetails: SubmissionStep = SUBMISSION_STEP_DETAILS) =>
  http.get(`${BASE_URL}submissions/:uuid/steps/:stepUuid`, () => {
    return HttpResponse.json(stepDetails, {status: 200});
  });

export const mockSubmissionStepValidatePost = (
  errors: Record<string, string> | undefined = undefined
) =>
  http.post(`${BASE_URL}submissions/:uuid/steps/:stepUuid/validate`, () => {
    if (!errors) {
      return new HttpResponse(null, {status: 204});
    }

    const invalidParams: InvalidParam[] = Object.entries(errors).map(([name, error]) => ({
      name: `data.${name}`,
      code: 'invalid',
      reason: error,
    }));
    const body = {
      type: 'http://localhost:8000/fouten/ValidationError/',
      code: 'invalid',
      title: 'Invalid input.',
      status: 400,
      detail: '',
      instance: 'urn:uuid:a3a9701b-3fa6-444b-a777-bcb43960440a',
      invalidParams: invalidParams,
    };
    return HttpResponse.json(body, {status: 400});
  });

export const mockSubmissionStepPut = (
  stepDetails: SubmissionStep = SUBMISSION_STEP_DETAILS,
  status: 200 | 201 = 200
) =>
  http.put(`${BASE_URL}submissions/:uuid/steps/:stepUuid`, () => {
    return HttpResponse.json(stepDetails, {status: status});
  });

export const mockSubmissionCheckLogicPost = (
  submission: Submission = SUBMISSION_DETAILS,
  step: SubmissionStep = SUBMISSION_STEP_DETAILS,
  delay: number = 0
) =>
  http.post(`${BASE_URL}submissions/:uuid/steps/:stepUuid/_check-logic`, async () => {
    const responseData = {submission, step};
    await sleep(delay);
    return HttpResponse.json(responseData, {status: 200});
  });

export const mockSubmissionSummaryGet = () =>
  http.get(`${BASE_URL}submissions/:uuid/summary`, () =>
    HttpResponse.json(
      [
        {
          slug: SUBMISSION_STEP_DETAILS.slug,
          name: SUBMISSION_DETAILS.steps[0].name,
          data: [
            {
              name: SUBMISSION_STEP_DETAILS.formStep.configuration.components[0].label,
              value: 'Component 1 value',
              component: SUBMISSION_STEP_DETAILS.formStep.configuration.components[0],
            },
          ],
        },
      ],
      {status: 200}
    )
  );

export const mockSubmissionCompletePost = () =>
  http.post(`${BASE_URL}submissions/:uuid/_complete`, () =>
    HttpResponse.json({
      statusUrl: `${BASE_URL}submissions/${SUBMISSION_DETAILS.id}/super-random-token/status`,
    })
  );

export const mockSubmissionCompleteInvalidPost = (invalidParams: InvalidParam[]) =>
  http.post(`${BASE_URL}submissions/:uuid/_complete`, () =>
    HttpResponse.json(
      {
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Does not validate.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams,
      },
      {status: 400}
    )
  );

/**
 * Simulate a successful backend processing status without payment.
 */
export const mockSubmissionProcessingStatusGet = http.get(
  `${BASE_URL}submissions/:uuid/:token/status`,
  () =>
    HttpResponse.json({
      status: 'done',
      result: 'success',
      errorMessage: '',
      publicReference: 'OF-L337',
      confirmationPageContent: `<p>Thank you for doing <span style="font-style: italic;">the thing</span>.`,
      reportDownloadUrl: '#',
      paymentUrl: `${BASE_URL}payment/4b0e86a8-dc5f-41cc-b812-c89857b9355b/demo/start`,
      mainWebsiteUrl: '#',
    })
);

export const mockSubmissionProcessingStatusPendingGet = http.get(
  `${BASE_URL}submissions/:uuid/:token/status`,
  () =>
    HttpResponse.json({
      status: 'in_progress',
      result: '',
      errorMessage: '',
      publicReference: '',
      confirmationPageContent: '',
      reportDownloadUrl: '',
      paymentUrl: '',
      mainWebsiteUrl: '',
    })
);

export const mockSubmissionProcessingStatusErrorGet = http.get(
  `${BASE_URL}submissions/:uuid/:token/status`,
  () =>
    HttpResponse.json({
      status: 'done',
      result: 'failed',
      errorMessage: 'Computer says no.',
      publicReference: '',
      confirmationPageContent: '',
      reportDownloadUrl: '',
      paymentUrl: '',
      mainWebsiteUrl: '',
    })
);

export const mockSubmissionPaymentStartPost = (
  data = {type: 'get', url: 'https://example.com', data: {}}
) => http.post(`${BASE_URL}payment/:uuid/demo/start`, () => HttpResponse.json(data));
