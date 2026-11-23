import {HttpResponse, http} from 'msw';

import type {FormProductDetailsProps} from '@/components/FormProductDetails';

import {BASE_URL} from './base';

export const mockFormProductDetails = (formUuid: string) =>
  http.get(`${BASE_URL}forms/${formUuid}/forms-product-details`, () => {
    return HttpResponse.json<FormProductDetailsProps>({
      productName: 'A product name',
      productContent: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
    });
  });
