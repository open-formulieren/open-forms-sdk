import {parseISO} from 'date-fns';
import set from 'lodash/set';

import {validateBoundaries} from './utils';

const createValidator = key => {
  return {
    key,
    message(component) {
      const options = {dateStyle: 'medium'};
      if (key === 'validate.datetimeMinMax') options.timeStyle = 'short';

      const minDate = component.options.intl.formatDate(
        parseISO(component.component.datePicker.minDate),
        options
      );
      const maxDate = component.options.intl.formatDate(
        parseISO(component.component.datePicker.maxDate),
        options
      );

      const errorKey =
        component.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey;
      const errorMessage = component.errorMessage(errorKey);

      return component.t(errorMessage, {minDate, maxDate});
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
