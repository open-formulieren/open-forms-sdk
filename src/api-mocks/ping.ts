import {HttpResponse, http} from 'msw';

import {BASE_URL} from './base';

export const mockPingGet = () =>
  http.get(`${BASE_URL}ping`, () => new HttpResponse(null, {status: 204}));
