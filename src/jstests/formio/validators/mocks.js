import {HttpResponse, http} from 'msw';

import {BASE_URL} from 'api-mocks';

const INTERNATIONAL_VALIDATION_ENDPOINT = `${BASE_URL}validation/plugins/phonenumber-international`;
const DUTCH_VALIDATION_ENDPOINT = `${BASE_URL}validation/plugins/phonenumber-nl`;

export const phoneNumberValidations = {
  mockValidInternationalPhonenumberPost: http.post(INTERNATIONAL_VALIDATION_ENDPOINT, () =>
    HttpResponse.json({isValid: true, messages: []})
  ),

  mockInValidInternationalPhonenumberPost: http.post(INTERNATIONAL_VALIDATION_ENDPOINT, () =>
    HttpResponse.json({isValid: false, messages: ['Invalid international phone number']})
  ),

  mockValidDutchPhonenumberPost: http.post(DUTCH_VALIDATION_ENDPOINT, async () =>
    HttpResponse.json({isValid: true, messages: []})
  ),

  mockInValidDutchPhonenumberPost: http.post(DUTCH_VALIDATION_ENDPOINT, async (req, res, ctx) =>
    HttpResponse.json({isValid: false, messages: ['Invalid dutch phone number']})
  ),
};
