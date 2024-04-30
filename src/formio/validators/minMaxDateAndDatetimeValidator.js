import set from 'lodash/set';

import {validateBoundaries} from './utils';

const createValidator = key => {
  return {
    key,
    message(component) {
      const minDate = new Date(component.component.minDate);
      const maxDate = new Date(component.component.maxDate);

      const errorKey =
        component.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey;
      const errorMessage = component.errorMessage(errorKey);

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

export const MinMaxDateValidator = createValidator('validate.dateMinMax');
export const MinMaxDatetimeValidator = createValidator('validate.datetimeMinMax');
