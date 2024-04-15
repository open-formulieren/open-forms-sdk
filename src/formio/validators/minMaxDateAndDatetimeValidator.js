import set from 'lodash/set';

import {validateBoundaries} from './utils';

const createValidator = (key, invalidKey) => {
  return {
    key,
    message(component) {
      const minDate = new Date(component.component.minDate);
      const maxDate = new Date(component.component.maxDate);

      const errorKey =
        component.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey;
      const componentErrorMessages = component.component.errors;
      const errorMessage =
        componentErrorMessages[errorKey] || componentErrorMessages[invalidKey] || errorKey;

      return component.t(errorMessage, {
        minDate: minDate,
        maxDate: maxDate,
      });
    },
    check(component, setting, value) {
      if (!value) return true;

      const {isValid, errorKey} = validateBoundaries(
        component.component.datePicker.minDate,
        component.component.datePicker.maxDate,
        value
      );

      if (!isValid) {
        set(
          component,
          'openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey',
          errorKey
        );
      }
      return isValid;
    },
  };
};

export const MinMaxDateValidator = createValidator('validate.dateMinMax', 'invalid_date');
export const MinMaxDatetimeValidator = createValidator(
  'validate.datetimeMinMax',
  'invalid_datetime'
);
