import type {SupportedLocales} from '@open-formulieren/types';
import {createState} from 'state-pool';

import {
  APIError,
  NotAuthenticated,
  NotFound,
  PermissionDenied,
  ServiceUnavailable,
  UnprocessableEntity,
  ValidationError,
} from './errors';
import {CSPNonce, CSRFToken, ContentLanguage, IsFormDesigner} from './headers';
import {setLanguage} from './i18n';

interface ApiCallOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

const fetchDefaults: ApiCallOptions = {
  credentials: 'include',
};

const SessionExpiresInHeader = 'X-Session-Expires-In';

interface SessionExpiryState {
  expiry: Date | null;
}

const sessionExpiresAt = createState<SessionExpiryState>({expiry: null});

export const updateSessionExpiry = (seconds: number): void => {
  const newExpiry = new Date();
  newExpiry.setSeconds(newExpiry.getSeconds() + seconds);
  sessionExpiresAt.setValue({expiry: newExpiry});
};

const throwForStatus = async (response: Response): Promise<void> => {
  if (response.ok) return;

  let responseData = null;
  // Check if the response contains json data
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    responseData = await response.json();
  }

  let ErrorClass = APIError;
  let errorMessage = 'An API error occurred.';
  switch (response.status) {
    case 400: {
      throw new ValidationError('Call did not validate on the backend', responseData || {});
    }
    case 401: {
      ErrorClass = NotAuthenticated;
      errorMessage = 'User not or no longer authenticated';
      break;
    }
    case 403: {
      ErrorClass = PermissionDenied;
      errorMessage = 'User has insufficient permissions.';
      break;
    }
    case 404: {
      ErrorClass = NotFound;
      errorMessage = 'Resource not found.';
      break;
    }
    case 422: {
      ErrorClass = UnprocessableEntity;
      errorMessage = 'Unprocessable Entity';
      break;
    }
    case 503: {
      ErrorClass = ServiceUnavailable;
      errorMessage = 'Service Unavailable';
      break;
    }
    default: {
      break;
    }
  }

  throw new ErrorClass(errorMessage, response.status, responseData.detail, responseData.code);
};

const addHeaders = (
  headers: Record<string, string> | undefined,
  method: string
): Record<string, string> => {
  if (!headers) headers = {};

  // add the CSP nonce request header in case the backend needs to do any post-processing
  const CSPNonceValue = CSPNonce.getValue();
  if (CSPNonceValue != null && CSPNonceValue) {
    headers[CSPNonce.headerName] = CSPNonceValue;
  }

  if (method !== 'GET') {
    const csrfTokenValue = CSRFToken.getValue();
    if (csrfTokenValue != null && csrfTokenValue) {
      headers[CSRFToken.headerName] = csrfTokenValue;
    }
  }

  return headers;
};

const updateStoredHeadersValues = (headers: Headers): void => {
  const sessionExpiry = headers.get(SessionExpiresInHeader);
  if (sessionExpiry) {
    updateSessionExpiry(parseInt(sessionExpiry, 10));
  }

  const CSRFTokenValue = headers.get(CSRFToken.headerName);
  if (CSRFTokenValue) {
    CSRFToken.setValue(CSRFTokenValue);
  }

  const isFormDesignerValue = headers.get(IsFormDesigner.headerName);
  if (isFormDesignerValue) {
    IsFormDesigner.setValue(isFormDesignerValue === 'true');
  }

  const contentLanguage = headers.get(ContentLanguage.headerName);
  if (contentLanguage) {
    // need to cast here since we don't have type/runtime safety guarantees about returned
    // values, but we have fallback code to treat unknown locales as english.
    ContentLanguage.setValue(contentLanguage as SupportedLocales);
    setLanguage(contentLanguage as SupportedLocales);
  }
};

const apiCall = async (url: string, opts: ApiCallOptions = {}): Promise<Response> => {
  const method = opts.method || 'GET';
  const options = {...fetchDefaults, ...opts};
  options.headers = addHeaders(options.headers, method);

  const response = await window.fetch(url, options);
  await throwForStatus(response);

  updateStoredHeadersValues(response.headers);
  return response;
};

/**
 * Make a GET api call to `url`, with optional query string parameters.
 *
 * The return data is the JSON response body, or `null` if there is no content. Specify
 * the generic type parameter `T` to get typed return data.
 */
const get = async <T = unknown>(
  url: string,
  params: Record<string, string> = {},
  multiParams: Record<string, string>[] = []
): Promise<T | null> => {
  let searchParams = new URLSearchParams();
  if (Object.keys(params).length) {
    searchParams = new URLSearchParams(params);
  }
  if (multiParams.length > 0) {
    multiParams.forEach(param => {
      const paramName = Object.keys(param)[0]; // param={foo: bar}
      searchParams.append(paramName, param[paramName]);
    });
  }
  url += `?${searchParams}`;
  const response = await apiCall(url);
  const data: T | null = response.status === 204 ? null : await response.json();
  return data;
};

export interface UnsafeResponseData<T = unknown> {
  /**
   * The parsed response body JSON, if there was one.
   */
  data: T | null;
  /**
   * Whether the request completed successfully or not.
   */
  ok: boolean;
  /**
   * The HTTP response status code.
   */
  status: number;
}

/**
 * Make an unsafe (POST, PUT, PATCH) API call to `url`.
 *
 * The return data is the JSON response body, or `null` if there is no content. Specify
 * the generic type parameter `T` to get typed return data, and `U` for strongly typing
 * the request data (before JSON serialization).
 */
const _unsafe = async <T = unknown, U = unknown>(
  method = 'POST',
  url: string,
  data?: U,
  signal?: AbortSignal | null
): Promise<UnsafeResponseData<T>> => {
  const opts: ApiCallOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      [CSRFToken.headerName]: CSRFToken.getValue() ?? '',
    },
  };
  if (data) {
    opts.body = JSON.stringify(data);
  }
  if (signal) {
    opts.signal = signal;
  }
  const response = await apiCall(url, opts);
  const responseData: T | null = response.status === 204 ? null : await response.json();
  return {
    ok: response.ok,
    status: response.status,
    data: responseData,
  };
};

/**
 * Make a POST call to `url`.
 *
 * The return data is the JSON response body, or `null` if there is no content. Specify
 * the generic type parameter `T` to get typed return data, and `U` for strongly typing
 * the request data (before JSON serialization).
 */
const post = async <T = unknown, U = unknown>(
  url: string,
  data?: U,
  signal?: AbortSignal | null
): Promise<UnsafeResponseData<T>> => await _unsafe<T, U>('POST', url, data, signal);

/**
 * Make a PATCH call to `url`.
 *
 * The return data is the JSON response body, or `null` if there is no content. Specify
 * the generic type parameter `T` to get typed return data, and `U` for strongly typing
 * the request data (before JSON serialization).
 */
const patch = async <T = unknown, U = unknown>(
  url: string,
  data: U
): Promise<UnsafeResponseData<T>> => await _unsafe<T, U>('PATCH', url, data);

/**
 * Make a PUT call to `url`.
 *
 * The return data is the JSON response body, or `null` if there is no content. Specify
 * the generic type parameter `T` to get typed return data, and `U` for strongly typing
 * the request data (before JSON serialization).
 */
const put = async <T = unknown, U = unknown>(
  url: string,
  data: U
): Promise<UnsafeResponseData<T>> => await _unsafe<T, U>('PUT', url, data);

/**
 * Make a DELETE call to `url`.
 *
 * If the delete was not successfull, an error is thrown.
 */
const destroy = async (url: string): Promise<void> => {
  const opts = {
    method: 'DELETE',
  };
  const response = await apiCall(url, opts);
  if (!response.ok) {
    const responseData = await response.json();
    console.error('Delete failed', responseData);
    throw new Error('Delete failed');
  }
};

export {apiCall, get, post, put, patch, destroy, sessionExpiresAt};
