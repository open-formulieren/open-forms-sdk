import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockEmailVerificationPost = rest.post(
  `${BASE_URL}submissions/email-verifications`,
  async (req, res, ctx) => {
    const {componentKey, email} = await req.json();
    return res(ctx.json({componentKey, email}));
  }
);
