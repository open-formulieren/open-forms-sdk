import {START_FORM_QUERY_PARAM} from '@/components/constants';
import type {FormLoginOption} from '@/data/forms';

interface LoginUrlExtraParams {
  /**
   * Submission ID to cosign, used in legacy cosign.
   *
   * @deprecated Cosign v1 is deprecated.
   */
  coSignSubmission?: string;
}

export const getLoginUrl = (
  loginOption: FormLoginOption,
  extraParams: LoginUrlExtraParams = {},
  extraNextParams: Record<string, string> = {}
): string => {
  if (loginOption.url === '#') return loginOption.url;
  const nextUrl = new URL(window.location.href);

  const queryParams = Array.from(nextUrl.searchParams.keys());
  queryParams.map(param => nextUrl.searchParams.delete(param));

  const loginUrl = new URL(loginOption.url);

  Object.entries(extraParams).map(([key, value]) => loginUrl.searchParams.set(key, value));

  if (!loginUrl.searchParams.has('coSignSubmission')) {
    nextUrl.searchParams.set(START_FORM_QUERY_PARAM, '1');
  }
  Object.entries(extraNextParams).map(([key, value]) => nextUrl.searchParams.set(key, value));
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};

interface CosignLoginUrlExtraParams {
  code?: string;
}

export const getCosignLoginUrl = (
  loginOption: FormLoginOption,
  extraParams: CosignLoginUrlExtraParams = {}
) => {
  const loginUrl = new URL(loginOption.url);
  const nextUrl = new URL(loginUrl.searchParams.get('next')!);
  Object.entries(extraParams).forEach(([key, value]) => nextUrl.searchParams.set(key, value));
  loginUrl.searchParams.set('next', nextUrl.toString());
  return loginUrl.toString();
};
