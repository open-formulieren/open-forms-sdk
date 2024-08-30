import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockEmailVerificationPost = rest.post(
  `${BASE_URL}submissions/email-verifications`,
  async (req, res, ctx) => {
    const {componentKey, email} = await req.json();
    return res(ctx.json({componentKey, email}));
  }
);

export const mockEmailVerificationVerifyCodePost = rest.post(
  `${BASE_URL}submissions/email-verifications/verify`,
  async (req, res, ctx) => {
    const {componentKey, email, code} = await req.json();

    const statusCode = code !== 'FAILME' ? 200 : 400;
    const responseData =
      statusCode === 200
        ? {componentKey, email}
        : {
            type: 'BadRequest',
            code: 'bad_request',
            title: 'Bad request',
            status: 400,
            detail: 'Data invalid',
            instance: 'urn:1234',
            invalidParams: [
              {name: 'code', code: 'invalid', reason: 'Not a valid verification code'},
            ],
          };
    return res(ctx.status(statusCode), ctx.json(responseData));
  }
);
