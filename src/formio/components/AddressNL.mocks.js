import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockBRKZaakgerechtigdeValidPost = http.post(
  `${BASE_URL}validation/plugins/brk-Zaakgerechtigde`,
  () => {
    const body = {
      isValid: true,
      messages: [],
    };
    return HttpResponse.json(body);
  }
);

export const mockBRKZaakgerechtigdeInvalidPost = http.post(
  `${BASE_URL}validation/plugins/brk-Zaakgerechtigde`,
  () => {
    const body = {
      isValid: false,
      messages: ['User is not a zaakgerechtigde for property.'],
    };
    return HttpResponse.json(body);
  }
);

export const mockBAGDataGet = http.get(`${BASE_URL}geo/address-autocomplete`, () => {
  const body = {
    streetName: 'Keizersgracht',
    city: 'Amsterdam',
    secretStreetCity: '',
  };
  return HttpResponse.json(body);
});

export const mockBAGNoDataGet = http.get(`${BASE_URL}geo/address-autocomplete`, () => {
  const body = {
    streetName: '',
    city: '',
    secretStreetCity: '',
  };
  return HttpResponse.json(body);
});
