import {HttpResponse, http} from 'msw';

import type {AutoCompleteResult} from '@/data/geo';

import {BASE_URL} from './base';

export const mockAddressAutoComplete = ({
  streetName,
  city,
}: Pick<AutoCompleteResult, 'streetName' | 'city'>) =>
  http.get(`${BASE_URL}geo/address-autocomplete`, () => {
    return HttpResponse.json<AutoCompleteResult>({
      streetName,
      city,
      secretStreetCity: 'dummy',
    });
  });
