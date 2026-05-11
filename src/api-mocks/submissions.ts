import type {AnyComponentSchema, JSONObject} from '@open-formulieren/types';
import {HttpResponse, http} from 'msw';

import type {FormioConfiguration} from '@/data/formio';
import type {LogicRule} from '@/data/logic';
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
      defaultIsApplicable: true,
      isApplicable: true,
      completed: false,
      canSubmit: true,
    },
    {
      id: 'a0ff2cfe-e59a-4881-88de-e1b0a76af8d3',
      name: 'Step 2',
      url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
      formStep: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
      defaultIsApplicable: true,
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

export const SINGLE_STEP_SUBMISSION_DETAILS = {
  id: '8aa254e2-49ec-4ad0-b58f-5c1e743b2796',
  url: `${BASE_URL}submissions/8aa254e2-49ec-4ad0-b58f-5c1e743b2796`,
  form: `${BASE_URL}forms/mock`,
  formUrl: 'http://localhost:3000/mock',
  initialDataReference: '',
  steps: [
    {
      id: '9cceb61c-9626-4a54-8168-b0199d48b512',
      name: 'Step 1',
      url: `${BASE_URL}submissions/8aa254e2-49ec-4ad0-b58f-5c1e743b2796/steps/9cceb61c-9626-4a54-8168-b0199d48b512`,
      formStep: `${BASE_URL}forms/mock/steps/3ad1734b-d095-4da0-8b7e-9f6900ffda17`,
      defaultIsApplicable: true,
      isApplicable: true,
      completed: false,
      canSubmit: true,
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

export const DEFAULT_FORMIO_CONFIGURATION: FormioConfiguration = {
  type: 'form',
  components: [
    {
      id: 'asdiwj',
      type: 'textfield',
      key: 'component1',
      label: 'Component 1',
    },
  ],
};

// mock for /api/v2/submissions/{submission_uuid}/steps/{step_uuid} in regular form
const SUBMISSION_STEP_DETAILS = {
  id: '58aad9c3-29c7-4568-9047-3ac7ceb0f0ff',
  slug: 'step-1',
  formStepUuid: 'f31e0bbb-0ad9-4dde-bb2c-9360c606f980',
  configuration: DEFAULT_FORMIO_CONFIGURATION,
  defaultConfiguration: null,
  requireBackendLogicEvaluation: true,
  logicRules: [],
  data: null,
  canSubmit: true,
} satisfies SubmissionStep;

// mock for /api/v2/submissions/{submission_uuid}/steps/{step_uuid} in single step form
export const SINGLE_STEP_SUBMISSION_STEP_DETAILS = {
  id: '9cceb61c-9626-4a54-8168-b0199d48b512',
  slug: 'step-1',
  formStepUuid: '3ad1734b-d095-4da0-8b7e-9f6900ffda17',
  configuration: DEFAULT_FORMIO_CONFIGURATION,
  defaultConfiguration: null,
  requireBackendLogicEvaluation: true,
  logicRules: [],
  data: null,
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
  formStepUuid?: string;
  requireBackendLogicEvaluation?: boolean;
  logicRules?: LogicRule[];
}

/**
 * Return a submission step object as if it would be returned from the backend API.
 */
export const buildSubmissionStep = ({
  components = SUBMISSION_STEP_DETAILS.configuration.components,
  data = null,
  canSubmit = true,
  formStepUuid = 'f31e0bbb-0ad9-4dde-bb2c-9360c606f980',
  requireBackendLogicEvaluation = true,
  logicRules = [],
}: BuildSubmissionStepOpts): SubmissionStep => {
  const formioConfiguration: FormioConfiguration = {type: 'form', components};
  return {
    id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
    slug: 'step-1',
    formStepUuid,
    configuration: formioConfiguration,
    defaultConfiguration: requireBackendLogicEvaluation ? null : formioConfiguration,
    requireBackendLogicEvaluation,
    logicRules,
    data,
    canSubmit,
  } satisfies SubmissionStep;
};

export const mockSubmissionStepGet = (
  stepDetails: SubmissionStep | undefined = SUBMISSION_STEP_DETAILS,
  stepDetailsMap?: Record<string, SubmissionStep>
) =>
  http.get<{uuid: string; stepUuid: string}>(
    `${BASE_URL}submissions/:uuid/steps/:stepUuid`,
    ({params}) => {
      const {stepUuid} = params;
      const stepDetailsResponse = stepDetailsMap ? stepDetailsMap[stepUuid] : stepDetails;
      return HttpResponse.json(stepDetailsResponse, {status: 200});
    }
  );

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
  http.get(`${BASE_URL}submissions/:uuid/summary`, () => {
    const component0 = SUBMISSION_STEP_DETAILS.configuration.components[0];
    return HttpResponse.json(
      [
        {
          slug: SUBMISSION_STEP_DETAILS.slug,
          name: SUBMISSION_DETAILS.steps[0].name,
          data: [
            {
              name: 'label' in component0 ? component0.label : '',
              value: 'Component 1 value',
              component: component0,
            },
          ],
        },
      ],
      {status: 200}
    );
  });

export const mockSubmissionCompletePost = (submissionId = SUBMISSION_DETAILS.id) =>
  http.post(`${BASE_URL}submissions/:uuid/_complete`, () =>
    HttpResponse.json({
      statusUrl: `${BASE_URL}submissions/${submissionId}/super-random-token/status`,
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
