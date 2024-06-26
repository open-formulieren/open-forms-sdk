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

export const mockBAGDataGet = rest.get(`${BASE_URL}geo/address-autocomplete`, (req, res, ctx) => {
  const body = {
    streetName: 'Keizersgracht',
    city: 'Amsterdam',
    secretStreetCity: '',
  };
  return res(ctx.status(200), ctx.json(body));
});

export const mockBAGNoDataGet = rest.get(`${BASE_URL}geo/address-autocomplete`, (req, res, ctx) => {
  const body = {
    streetName: '',
    city: '',
    secretStreetCity: '',
  };
  return res(ctx.status(200), ctx.json(body));
});
