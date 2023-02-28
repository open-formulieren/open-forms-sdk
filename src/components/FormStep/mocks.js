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
