import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

import {STATEMENTS_INFO_ENDPOINT} from '.';

const DEFAULT_DECLARATIONS = [
  {
    key: 'privacyPolicyAccepted',
    type: 'checkbox',
    validate: {required: true},
    label: 'I accept the privacy policy and consent to the processing of my personal data.',
  },
];

export const mockDeclarationsConfigGet = (declarations = DEFAULT_DECLARATIONS) =>
  rest.get(`${BASE_URL}${STATEMENTS_INFO_ENDPOINT}`, (req, res, ctx) =>
    res(ctx.json(declarations))
  );
