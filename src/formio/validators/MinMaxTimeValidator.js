import set from 'lodash/set';
import moment from 'moment';

const validateTimeBoundaries = (minBoundary, maxBoundary, timeValue) => {
  const minTime = minBoundary ? moment(minBoundary, 'HH:mm:ss') : null;
  const maxTime = maxBoundary ? moment(maxBoundary, 'HH:mm:ss') : null;
  const parsedValue = moment(timeValue, 'HH:mm:ss');

  // Case 0: no boundaries given
  if (!minTime && !maxTime) {
    return {isValid: true};
  }

  // Case 1: only one boundary is given
  if (!minTime || !maxTime) {
    if (minTime) return {isValid: parsedValue >= minTime, errorKeys: ['minTime']};
    if (maxTime) return {isValid: parsedValue < maxTime, errorKeys: ['maxTime']};
  } else {
    // Case 2: min boundary is smaller than max boundary
    if (minTime < maxTime) {
      const isTooEarly = parsedValue < minTime;
      const isTooLate = parsedValue >= maxTime;
      return {
        isValid: !isTooEarly && !isTooLate,
        errorKeys: [isTooEarly ? 'minTime' : 'maxTime', 'invalid_time'],
      };
    } else {
      // Case 3: min boundary is bigger than max boundary (it's the next day. For example min = 08:00, max = 01:00)
      return {
        isValid: !(parsedValue >= maxTime && parsedValue < minTime),
        errorKeys: ['invalid_time'],
      };
    }
  }
};

const MinMaxTimeValidator = {
  key: 'validate.timeMinMax',
  message(component) {
    const minTime = moment(component.component.minTime || '00:00:00', 'HH:mm:ss').format('HH:mm');
    const maxTime = moment(component.component.maxTime || '23:59:59', 'HH:mm:ss').format('HH:mm');

    let errorMessage = component.component.errors?.invalid_time || 'invalid_time';
    const errorKeys = component?.openForms?.validationErrorContext?.minMaxTimeValidatorErrorKeys;
    const componentErrorMessages = component.component.errors;

    // The error keys are in order of priority: for example, if a time is below minTime, the
    // errorKeys would be ['minTime', 'invalid_time']. If the form designer configured a custom minTime
    // error message, it will be used. Otherwise, it will check if a 'invalid_time' custom error was used.
    // If not, it will fall back on the default 'invalid_time'.
    if (errorKeys && componentErrorMessages) {
      for (const errorKey of errorKeys) {
        if (componentErrorMessages[errorKey]) {
          errorMessage = componentErrorMessages[errorKey];
          break;
        }
      }
    }

    return component.t(errorMessage, {
      minTime: minTime,
      maxTime: maxTime,
    });
  },
  check(component, setting, value) {
    if (!value) return true;

    const {isValid, errorKeys} = validateTimeBoundaries(
      component.component.minTime,
      component.component.maxTime,
      value
    );

    if (!isValid) {
      set(component, 'openForms.validationErrorContext.minMaxTimeValidatorErrorKeys', errorKeys);
    }
    return isValid;
  },
};

export default MinMaxTimeValidator;
