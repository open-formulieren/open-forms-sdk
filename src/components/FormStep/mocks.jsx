import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

const DEFAULT_FORMIO_CONFIGURATION = {
  display: 'form',
  components: [],
};

export const getSubmissionStepDetail = ({
  formioConfiguration = DEFAULT_FORMIO_CONFIGURATION,
  data = {},
  overrides = {},
}) => ({
  id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
  slug: 'step-1',
  formStep: {
    index: 0,
    configuration: formioConfiguration,
  },
  data: data,
  isApplicable: true,
  completed: false,
  canSubmit: true,
  ...overrides,
});

export const mockSubmissionStepGet = body =>
  http.get(`${BASE_URL}submissions/:submissionUuid/steps/:stepUuid`, () => HttpResponse.json(body));

export const mockSubmissionLogicCheckPost = (submission, step) => {
  return http.post(`${BASE_URL}submissions/:submissionUuid/steps/:stepUuid/_check_logic`, () =>
    HttpResponse.json({submission, step})
  );
};

export const mockSubmissionValidatePost = (errors = undefined) => {
  return http.post(`${BASE_URL}submissions/:submissionUuid/steps/:stepUuid/validate`, () => {
    if (!errors) {
      return new HttpResponse(null, {status: 204});
    }

    const invalidParams = Object.entries(errors).map(([name, error]) => ({
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
};
