import set from 'lodash/set';

const validateDateBoundaries = (minBoundary, maxBoundary, value) => {
  const minDate = minBoundary ? new Date(minBoundary) : null;
  const maxDate = maxBoundary ? new Date(maxBoundary) : null;

  if (!minDate && !maxDate) {
    return {isValid: true};
  }

  const parsedValue = new Date(value);

  if (minDate && maxDate) {
    const isValid = parsedValue >= minDate && parsedValue <= maxDate;
    let errorKeys = isValid ? [] : parsedValue < minDate ? ['minDate'] : ['maxDate'];
    return {isValid, errorKeys};
  }

  if (minDate) return {isValid: parsedValue >= minDate, errorKeys: ['minDate']};
  if (maxDate) return {isValid: parsedValue <= maxDate, errorKeys: ['maxDate']};
};

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

    const {isValid, errorKeys} = validateDateBoundaries(
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
