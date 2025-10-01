import {HttpResponse, http} from 'msw';

import type {InvalidParam} from '@/errors';

import {BASE_URL} from './base';

/**
 * Mock a successful appointment cancellation request.
 */
export const mockAppointmentCancelPost = http.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  () => new HttpResponse(null, {status: 204})
);

/**
 * Mock an appointment cancellation request with email validation error.
 */
export const mockAppointmentCancelErrorPost = http.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  () =>
    HttpResponse.json(
      {
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Invalid input.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams: [
          {
            name: 'email',
            code: 'invalid',
            reason: 'Invalid e-mail for the submission.',
          } satisfies InvalidParam,
        ],
      },
      {status: 400}
    )
);
