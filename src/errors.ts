import type {JSONObject} from '@open-formulieren/formio-renderer/types.js';
import {type FormikErrors, type FormikTouched, getIn, setIn} from 'formik';

// See https://stackoverflow.com/a/43595110 and https://stackoverflow.com/a/32749533
class ExtendableError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

interface InvalidParam {
  name: string;
  code: string;
  reason: string;
}

export interface Http400ResponseBody {
  type?: string;
  code: string;
  title: string;
  status: 400;
  detail: string;
  instance: string;
  invalidParams: InvalidParam[];
}

interface ValidationErrorAsFormikProps {
  initialErrors: FormikErrors<JSONObject>;
  initialTouched: FormikTouched<JSONObject>;
}

export class ValidationError extends ExtendableError {
  private _errors: InvalidParam[];

  public constructor(message: string, errors: Http400ResponseBody) {
    super(message);
    this._errors = errors.invalidParams;
  }

  public get invalidParams(): InvalidParam[] {
    return this._errors;
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
  public asFormikProps(): ValidationErrorAsFormikProps {
    let initialErrors: FormikErrors<JSONObject> = {};
    let initialTouched: FormikTouched<JSONObject> = {};

    this.invalidParams.forEach(err => {
      const {name, reason} = err;
      initialTouched = setIn(initialTouched, name, true);

      const existingErrorMessage = getIn(initialErrors, name, '');
      const formikError = existingErrorMessage ? [existingErrorMessage, reason].join('\n') : reason;
      initialErrors = setIn(initialErrors, name, formikError);
    });
    return {initialErrors, initialTouched};
  }
}

export class APIError extends ExtendableError {
  public statusCode: number;
  public detail: string;
  public code: string;

  public constructor(message: string, statusCode: number, detail: string, code: string) {
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
