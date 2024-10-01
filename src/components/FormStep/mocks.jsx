import {rest} from 'msw';

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
  rest.get(`${BASE_URL}submissions/:submissionUuid/steps/:stepUuid`, (req, res, ctx) =>
    res(ctx.json(body))
  );

export const mockSubmissionLogicCheckPost = (submission, step) => {
  return rest.post(
    `${BASE_URL}submissions/:submissionUuid/steps/:stepUuid/_check_logic`,
    (req, res, ctx) => {
      const body = {submission, step};
      return res(ctx.json(body));
    }
  );
};

export const mockSubmissionValidatePost = (errors = undefined) => {
  return rest.post(
    `${BASE_URL}submissions/:submissionUuid/steps/:stepUuid/validate`,
    (req, res, ctx) => {
      if (!errors) {
        return res(ctx.status(204));
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
      return res(ctx.status(400), ctx.json(body));
    }
  );
};
