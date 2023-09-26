import {
  inValidSamples,
  phoneNumberComponent,
  validSamples,
} from 'jstests/formio/components/fixtures/phonenumber';

import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {pluginsAPIValidator} from 'formio/validators/plugins';

import {
  mockDutchInValidPost,
  mockDutchValidPost,
  mockInternationalInValidPost,
  mockInternationalValidPost,
} from './mocks';

describe('The OpenForms plugins validation', () => {
  test('tests expected errors are returned when phone number is invalid', async () => {
    mswServer.use(mockDutchInValidPost, mockInternationalInValidPost);

    const component = {
      component: phoneNumberComponent,
      options: {
        baseUrl: BASE_URL,
      },
    };

    for (const sample of inValidSamples) {
      const result = await pluginsAPIValidator.check(component, undefined, sample);
      expect(result).toBe('Invalid international phone number<br>Invalid dutch phone number');
    }
  });

  test('tests no errors are returned when phone number is valid', async () => {
    mswServer.use(mockDutchValidPost, mockInternationalValidPost);

    const component = {
      component: phoneNumberComponent,
      options: {
        baseUrl: BASE_URL,
      },
    };

    for (const sample of validSamples) {
      const result = await pluginsAPIValidator.check(component, undefined, sample);
      expect(result).toBe(true);
    }
  });

  test('tests no errors are returned when phone number is null', async () => {
    mswServer.use(mockDutchValidPost, mockInternationalValidPost);

    const component = {
      component: phoneNumberComponent,
      options: {
        baseUrl: BASE_URL,
      },
    };

    const result = await pluginsAPIValidator.check(component, undefined, null);
    expect(result).toBe(true);
  });
});
