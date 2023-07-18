import get from 'lodash/get';
import set from 'lodash/set';

// See https://stackoverflow.com/a/43595110 and https://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class ValidationError extends ExtendableError {
  constructor(message, errors) {
    super(message);
    this._errors = errors.invalidParams;
  }

  get invalidParams() {
    return this._errors;
  }

  get errors() {
    // merge errors back per component
    const errorsPerComponent = {};

    for (const err of this._errors) {
      if (!errorsPerComponent[err.name]) errorsPerComponent[err.name] = [];
      errorsPerComponent[err.name].push(err);
    }

    return errorsPerComponent;
  }

  /**
   * Emit the validation errors into datastructures suitable for Formik.
   *
   * This converts the error/field names into nested objects/arrays with the appropriate
   * error information *based on what the backend returns*. You may need to do additional
   * mapping in your component(s) if you're adding additional wrapper datastructures.
   *
   * @return {Object} Object with the `initialErrors` and `initialTouched` keys/props,
   *   derived from the error field names.
   */
  asFormikProps() {
    const initialErrors = {};
    const initialTouched = {};

    this.invalidParams.forEach(err => {
      const {name, reason} = err;
      set(initialTouched, name, true);

      const existingErrorMessage = get(initialErrors, name, '');
      const formikError = existingErrorMessage ? [existingErrorMessage, reason].join('\n') : reason;
      set(initialErrors, name, formikError);
    });
    return {initialErrors, initialTouched};
  }
}

export class APIError extends ExtendableError {
  constructor(message, statusCode, detail, code) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
    this.code = code;
  }
}

export class NotAuthenticated extends APIError {}
export class PermissionDenied extends APIError {}
export class NotFound extends APIError {}
export class UnprocessableEntity extends APIError {}
export class ServiceUnavailable extends APIError {}
