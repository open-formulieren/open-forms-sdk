import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockEmailVerificationPost = rest.post(
  `${BASE_URL}submissions/email-verifications`,
  async (req, res, ctx) => {
    const {componentKey, email} = await req.json();
    return res(ctx.json({componentKey, email}));
  }
);

export const mockEmailVerificationErrorPost = rest.post(
  `${BASE_URL}submissions/email-verifications`,
  async (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json({
        type: 'PermissonDenied',
        code: 'permission_denied',
        title: 'Permission denied',
        status: 403,
        detail: 'No permission to perform this action.',
        instance: 'urn:5678',
      })
    );
  }
);

const codeToStatus = {
  FAILME: 400,
  NOPERM: 403,
};

const statusToBody = {
  400: {
    type: 'BadRequest',
    code: 'bad_request',
    title: 'Bad request',
    status: 400,
    detail: 'Data invalid',
    instance: 'urn:1234',
    invalidParams: [{name: 'code', code: 'invalid', reason: 'Not a valid verification code'}],
  },
  403: {
    type: 'PermissonDenied',
    code: 'permission_denied',
    title: 'Permission denied',
    status: 403,
    detail: 'No permission to perform this action.',
    instance: 'urn:5678',
  },
};

export const mockEmailVerificationVerifyCodePost = rest.post(
  `${BASE_URL}submissions/email-verifications/verify`,
  async (req, res, ctx) => {
    const {componentKey, email, code} = await req.json();

    const statusCode = codeToStatus?.[code] ?? 200;

    const responseData = statusCode === 200 ? {componentKey, email} : statusToBody[statusCode];
    return res(ctx.status(statusCode), ctx.json(responseData));
  }
);
