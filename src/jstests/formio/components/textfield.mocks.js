import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockLocationGet = result =>
  http.get(`${BASE_URL}geo/address-autocomplete`, () => {
    return HttpResponse.json(result);
  });
