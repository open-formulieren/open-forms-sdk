import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

const INTERNATIONAL_VALIDATION_ENDPOINT = `${BASE_URL}validation/plugins/phonenumber-international`;
const DUTCH_VALIDATION_ENDPOINT = `${BASE_URL}validation/plugins/phonenumber-nl`;

export const mockInternationalValidPost = rest.post(
  INTERNATIONAL_VALIDATION_ENDPOINT,
  async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({isValid: true, messages: []}));
  }
);

export const mockInternationalInValidPost = rest.post(
  INTERNATIONAL_VALIDATION_ENDPOINT,
  async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({isValid: false, messages: ['Invalid international phone number']})
    );
  }
);

export const mockDutchValidPost = rest.post(DUTCH_VALIDATION_ENDPOINT, async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({isValid: true, messages: []}));
});

export const mockDutchInValidPost = rest.post(DUTCH_VALIDATION_ENDPOINT, async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({isValid: false, messages: ['Invalid dutch phone number']}));
});
