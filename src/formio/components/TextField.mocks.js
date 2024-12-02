import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockAddressAutoCompleteGet = (street = 'Keizersgracht', city = 'Amsterdam') =>
  http.get(`${BASE_URL}geo/address-autocomplete`, () => {
    return HttpResponse.json({streetName: street, city});
  });
