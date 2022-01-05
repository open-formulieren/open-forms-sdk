const fetchDefaults = {
  credentials: 'include', // required for Firefox 60, which is used in werkplekken
};

const SessionExpiresInHeader = "X-Session-Expires-In";

export let sessionExpiresAt = null;

const updateSesionExpiry = (seconds) => {
  const newExpiry = new Date();

  console.log(seconds, newExpiry);
  newExpiry.setSeconds(newExpiry.getSeconds() + seconds);
  sessionExpiresAt = newExpiry;
};

const apiCall = async (url, opts, alertOnPermissionDenied=false) => {
  const options = { ...fetchDefaults, ...opts };
  const response = await window.fetch(url, options);

  const sessionExpiry = response.headers.get(SessionExpiresInHeader);
  if (sessionExpiry) {
    updateSesionExpiry(parseInt(sessionExpiry), 10);
  }

  if (response.status === 403 && alertOnPermissionDenied) {
    const data = await response.json();
    alert(data.detail);
    response.json = () => Promise.resolve(data);
  }
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
  // we do not include the X-Csrftoken header, since the SDK is primarily meant to run
  // in both cross-domain and same-site origins. In cross-domain contexts, the CSRF
  // cookie is not available to be read (or sent).
  //
  // This isn't really relevant anyway, since we have explicit CORS settings in the
  // backend on which origins to trust (protecting against CSRF attacks) and the
  // endpoints don't have actual authenticated user sessions - only "generic" sessions
  // that do not map to an (admin) user.
  const opts = {
      method,
      headers: {
          'Content-Type': 'application/json',
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
};
