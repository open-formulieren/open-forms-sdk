import omit from 'lodash/omit';

import {post, put} from 'api';
import {ValidationError} from 'errors';

/**
 * Submits the form step data to the backend.
 * @param {string} stepUrl
 * @param {Object} data The submission json object.
 * @throws {Error} Throws an error if the backend response is not ok.
 * @return {Promise}
 */
export const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});

  if (!stepDataResponse.ok) {
    throw new Error(`Backend responded with HTTP ${stepDataResponse.status}`);
  }

  return stepDataResponse;
};

/**
 * Provides a hook to inject custom validations into the submission process.
 * @see {@link Form.io documentation} https://help.form.io/developers/form-renderer#customvalidation-submission-next
 *
 * @param {string} stepUrl
 * @param {Function} onBackendError
 * @return {Function}
 */
export const getCustomValidationHook = (stepUrl, onBackendError) => {
  /**
   * The custom validation function.
   *
   * @param {Object} data The submission data object that is going to be submitted to the server.
   *   This allows you to alter the submission data object in real time.
   * @param {Object} next Called when the beforeSubmit handler is done executing. If you call this
   *   method without any arguments, like next(), then this means that no errors should be added to
   *   the default form validation. If you wish to introduce your own custom errors, then you can
   *   call this method with either a single error object, or an array of errors like the example
   *   below.
   */
  return async (data, next) => {
    const PREFIX = 'data';
    const validateUrl = `${stepUrl}/validate`;
    let validateResponse;

    try {
      validateResponse = await post(validateUrl, data);
    } catch (error) {
      if (error instanceof ValidationError) {
        // process the errors
        const invalidParams = error.invalidParams.filter(param =>
          param.name.startsWith(`${PREFIX}.`)
        );

        const errors = invalidParams.map(({name, code, reason}) => ({
          path: name.replace(`${PREFIX}.`, '', 1),
          message: reason,
          code: code,
        }));

        next(errors);
        return;
      } else {
        onBackendError(error);
        next([{path: '', message: error.detail, code: error.code}]);
        return;
      }
    }

    if (!validateResponse.ok) {
      console.warn(`Unexpected HTTP ${validateResponse.status}`);
    }

    next();
  };
};

/**
 * Submits the form step data to the backend in order te evaluate its logic using the _check-logic
 * endpoint.
 * @param {string} stepUrl
 * @param {Object} data The current form data.
 * @param {*[]} invalidKeys
 * @param {*} signal
 * @throws {Error} Throws an error if the backend response is not ok.
 * @return {Promise}
 */
export const doLogicCheck = async (stepUrl, data, invalidKeys = [], signal) => {
  const url = `${stepUrl}/_check-logic`;
  // filter out the invalid keys so we only send valid (client-side) input data to the
  // backend to evaluate logic.
  let dataForLogicCheck = invalidKeys.length ? omit(data, invalidKeys) : data;
  const stepDetailData = await post(url, {data: dataForLogicCheck}, signal);

  if (!stepDetailData.ok) {
    throw new Error('Invalid response'); // TODO -> proper error & use ErrorBoundary
  }

  // Re-add any invalid data to the step data that was not sent for the logic check. Otherwise, any previously saved
  // data in the step will overwrite the user input
  if (invalidKeys.length) {
    Object.assign(stepDetailData.data.step.data, data);
  }

  return stepDetailData.data;
};
