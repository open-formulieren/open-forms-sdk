import {HttpResponse, http} from 'msw';

import {BASE_URL} from '@/api-mocks';

interface EmailVerificationResponse {
  componentKey: string;
  email: string;
}

export const mockEmailVerificationPost = http.post(
  `${BASE_URL}submissions/email-verifications`,
  async ({request}) => {
    const obj = (await request.json()) as EmailVerificationResponse;
    const {componentKey, email} = obj;
    return HttpResponse.json<EmailVerificationResponse>({componentKey, email});
  }
);

export const mockEmailVerificationErrorPost = http.post(
  `${BASE_URL}submissions/email-verifications`,
  () =>
    HttpResponse.json(
      {
        type: 'PermissonDenied',
        code: 'permission_denied',
        title: 'Permission denied',
        status: 403,
        detail: 'No permission to perform this action.',
        instance: 'urn:5678',
      },
      {status: 403}
    )
);

const codeToStatus = {
  FAILME: 400,
  NOPERM: 403,
};

const statusToBody = {
  400: {
    type: 'BadRequest',
    code: 'bad_request',
    title: 'Bad request',
    status: 400,
    detail: 'Data invalid',
    instance: 'urn:1234',
    invalidParams: [{name: 'code', code: 'invalid', reason: 'Not a valid verification code'}],
  },
  403: {
    type: 'PermissonDenied',
    code: 'permission_denied',
    title: 'Permission denied',
    status: 403,
    detail: 'No permission to perform this action.',
    instance: 'urn:5678',
  },
};

interface EmailVerificationVerifyCodeResponse {
  componentKey: string;
  email: string;
  code: 'FAILME' | 'NOPERM';
}

export const mockEmailVerificationVerifyCodePost = http.post(
  `${BASE_URL}submissions/email-verifications/verify`,
  async ({request}) => {
    const {componentKey, email, code} =
      (await request.json()) as EmailVerificationVerifyCodeResponse;

    const statusCode = codeToStatus?.[code] ?? 200;

    const responseData =
      statusCode === 200 ? {componentKey, email} : statusToBody[statusCode as 400 | 403];
    return HttpResponse.json(responseData, {status: statusCode});
  }
);
