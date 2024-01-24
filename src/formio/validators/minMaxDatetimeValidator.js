import set from 'lodash/set';

import {validateBoundaries} from './utils';

const MinMaxDatetimeValidator = {
  key: 'validate.datetimeMinMax',
  message(component) {
    // In the form builder, this property is called 'minDate'/'maxDate' also in the datetime component
    const minDatetime = new Date(component.component.minDate);
    const maxDatetime = new Date(component.component.maxDate);

    const errorKeys =
      component?.openForms?.validationErrorContext?.minMaxDatetimeValidatorErrorKeys;
    const errorMessage = errorKeys ? errorKeys[0] : 'invalidDatetime';

    return component.t(errorMessage, {
      minDatetime: minDatetime,
      maxDatetime: maxDatetime,
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
      set(
        component,
        'openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys',
        errorKeys
      );
    }
    return isValid;
  },
};

export default MinMaxDatetimeValidator;
