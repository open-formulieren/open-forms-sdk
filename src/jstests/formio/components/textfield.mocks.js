import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

export const mockLocationGet = result =>
  http.get(`${BASE_URL}location/get-street-name-and-city`, () => {
    return HttpResponse.json(result);
  });
