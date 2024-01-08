import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockBRKZaakgerechtigdeValidPost = rest.post(
  `${BASE_URL}validation/plugins/brk-Zaakgerechtigde`,
  (req, res, ctx) => {
    const body = {
      isValid: true,
      messages: [],
    };
    return res(ctx.json(body));
  }
);

export const mockBRKZaakgerechtigdeInvalidPost = rest.post(
  `${BASE_URL}validation/plugins/brk-Zaakgerechtigde`,
  (req, res, ctx) => {
    const body = {
      isValid: false,
      messages: ['User is not a zaakgerechtigde for property.'],
    };
    return res(ctx.json(body));
  }
);
