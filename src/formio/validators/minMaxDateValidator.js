import set from 'lodash/set';

import {validateBoundaries} from './utils';

const MinMaxDateValidator = {
  key: 'validate.dateMinMax',
  message(component) {
    const minDate = new Date(component.component.minDate);
    const maxDate = new Date(component.component.maxDate);

    const errorKeys = component?.openForms?.validationErrorContext?.minMaxDateValidatorErrorKeys;
    const errorMessage = errorKeys ? errorKeys[0] : 'invalidDate';

    return component.t(errorMessage, {
      minDate: minDate,
      maxDate: maxDate,
    });
  },
  check(component, setting, value) {
    if (!value) return true;

    const {isValid, errorKeys} = validateBoundaries(
      component.type,
      component.component.datePicker.minDate,
      component.component.datePicker.maxDate,
      value
    );

    if (!isValid) {
      set(component, 'openForms.validationErrorContext.minMaxDateValidatorErrorKeys', errorKeys);
    }
    return isValid;
  },
};

export default MinMaxDateValidator;
