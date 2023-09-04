import set from 'lodash/set';
import moment from 'moment';

const ERROR_CASES = {
  ONLY_MIN: 'onlyMin',
  ONLY_MAX: 'onlyMax',
  MIN_SMALLER_THAN_MAX: 'minSmallerThanMax',
  MAX_SMALLER_THAN_MIN: 'maxSmallerThanMin',
};

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
    if (minTime) return {isValid: parsedValue >= minTime, error: ERROR_CASES.ONLY_MIN};
    if (maxTime) return {isValid: parsedValue < maxTime, error: ERROR_CASES.ONLY_MAX};
  } else {
    // Case 2: min boundary is smaller than max boundary
    if (minTime < maxTime) {
      return {
        isValid: parsedValue >= minTime && parsedValue < maxTime,
        error: ERROR_CASES.MIN_SMALLER_THAN_MAX,
      };
    } else {
      // Case 3: min boundary is bigger than max boundary (it's the next day. For example min = 08:00, max = 01:00)
      return {
        isValid: !(parsedValue >= maxTime && parsedValue < minTime),
        error: ERROR_CASES.MAX_SMALLER_THAN_MIN,
      };
    }
  }
};

const MinMaxTimeValidator = {
  key: 'validate.timeMinMax',
  message(component) {
    const minTime = moment(component.component.minTime || '00:00:00', 'HH:mm:ss').format('HH:mm');
    const maxTime = moment(component.component.maxTime || '23:59:59', 'HH:mm:ss').format('HH:mm');

    let errorMessage;
    const genericError = component.component.errors?.invalid_time ?? 'invalid_time';
    switch (component?.openForms?.validationErrorContext?.timeError) {
      case ERROR_CASES.ONLY_MIN: {
        errorMessage = component.component.errors?.minTime ?? genericError;
        break;
      }
      case ERROR_CASES.ONLY_MAX: {
        errorMessage = component.component.errors?.maxTime ?? genericError;
        break;
      }
      case ERROR_CASES.MIN_SMALLER_THAN_MAX:
      case ERROR_CASES.MAX_SMALLER_THAN_MIN: {
        // Here we display the generic error, because it is ambiguous which error message should be
        // shown between minTime/maxTime.
        errorMessage = genericError;
        break;
      }
      default: {
        errorMessage = 'invalid_time';
      }
    }

    return component.t(errorMessage, {
      minTime: minTime,
      maxTime: maxTime,
    });
  },
  check(component, setting, value) {
    if (!value) return true;

    const {isValid, error} = validateTimeBoundaries(
      component.component.minTime,
      component.component.maxTime,
      value
    );

    if (!isValid) {
      set(component, 'openForms.validationErrorContext', {timeError: error});
    }
    return isValid;
  },
};

export default MinMaxTimeValidator;
