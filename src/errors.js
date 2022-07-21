// See https://stackoverflow.com/a/43595110 and https://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
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

};

export class APIError extends ExtendableError {
  constructor(message, statusCode, detail) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export class NotAuthenticated extends APIError {}
export class PermissionDenied extends APIError {}
export class NotFound extends APIError {}
