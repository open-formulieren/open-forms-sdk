import {createGlobalstate} from 'state-pool';

import {CSPNonceHeader, CSRFTokenHeader, IsFormDesignerHeader} from './headers';

import {
  APIError,
  ValidationError,
  NotAuthenticated,
  PermissionDenied,
  NotFound,
  UnprocessableEntity,
  ServiceUnavailable,
} from './errors';

const fetchDefaults = {
  credentials: 'include', // required for Firefox 60, which is used in werkplekken
};

const SessionExpiresInHeader = 'X-Session-Expires-In';

let sessionExpiresAt = createGlobalstate(null);

const updateSesionExpiry = (seconds) => {
  const newExpiry = new Date();
  newExpiry.setSeconds(newExpiry.getSeconds() + seconds);
  sessionExpiresAt.setValue(newExpiry);
};

const throwForStatus = async (response) => {
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

  throw new ErrorClass(
    errorMessage,
    response.status,
    responseData.detail,
    responseData.code,
  );
};

const addHeaders = (headers, method) => {
  if (!headers) headers = {};

  // add the CSP nonce request header in case the backend needs to do any post-processing
  const CSPNonce = CSPNonceHeader.getValue();
  if (CSPNonce != null && CSPNonce) {
    headers[CSPNonceHeader.name] = CSPNonce;
  }

  if (method !== 'GET') {
    const csrfToken = CSRFTokenHeader.getValue();
    if (csrfToken != null && csrfToken) {
      headers[CSRFTokenHeader.name] = csrfToken;
    }
  }

  return headers;
};

const updateStoredHeadersValues = (headers) => {
  const sessionExpiry = headers.get(SessionExpiresInHeader);
  if (sessionExpiry) {
    updateSesionExpiry(parseInt(sessionExpiry), 10);
  }

  const CSRFToken = headers.get(CSRFTokenHeader.name);
  if (CSRFToken) {
    CSRFTokenHeader.setValue(CSRFToken);
  }

  const isFormDesigner = headers.get(IsFormDesignerHeader.name);
  if (isFormDesigner) {
    IsFormDesignerHeader.setValue(isFormDesigner === 'true');
  }
};

const apiCall = async (url, opts={}) => {
  const method = opts.method || 'GET';
  const options = { ...fetchDefaults, ...opts };
  options.headers = addHeaders(options.headers, method);

  const response = await window.fetch(url, options);
  await throwForStatus(response);

  updateStoredHeadersValues(response.headers);
  return response;
};

const get = async (url, params = {}, multiParams = []) => {
  let searchParams = new URLSearchParams();
  if (Object.keys(params).length) {
      searchParams = new URLSearchParams(params);
  }
  if (multiParams.length > 0) {
      multiParams.forEach((param) => {
          const paramName = Object.keys(param)[0]; // param={foo: bar}
          searchParams.append(paramName, param[paramName]);
      });
  }
  url += `?${searchParams}`;
  const response = await apiCall(url);
  const data = await response.json();
  return data;
};

const _unsafe = async (method = 'POST', url, data, signal) => {
  const opts = {
      method,
      headers: {
          'Content-Type': 'application/json',
          [CSRFTokenHeader.name]: CSRFTokenHeader.getValue(),
      },
  };
  if (data) {
    opts.body = JSON.stringify(data);
  }
  if (signal) {
    opts.signal = signal;
  }
  const response = await apiCall(url, opts);
  const responseData = (response.status === 204) ? null : (await response.json());
  return {
      ok: response.ok,
      status: response.status,
      data: responseData,
  };
};

const post = async (url, data, signal) => {
  const resp = await _unsafe('POST', url, data, signal);
  return resp;
};

const patch = async (url, data = {}) => {
  const resp = await _unsafe('PATCH', url, data);
  return resp;
};

const put = async (url, data = {}) => {
  const resp = await _unsafe('PUT', url, data);
  return resp;
};

const destroy = async (url) => {
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

export {
    apiCall, get, post, put, patch, destroy,
    sessionExpiresAt,
};
