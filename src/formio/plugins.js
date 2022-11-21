import {CSRFToken} from 'headers';

const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const AddFetchAuth = {
  priority: 0,
  requestOptions: (options, url) => {
    options.credentials = 'include';
    if (UNSAFE_METHODS.includes(options.method)) {
      const csrfTokenValue = CSRFToken.getValue();
      if (csrfTokenValue != null && csrfTokenValue && !options.headers[CSRFToken.headerName]) {
        options.headers[CSRFToken.headerName] = csrfTokenValue;
      }
    }
    return options;
  },
};

export {AddFetchAuth};
