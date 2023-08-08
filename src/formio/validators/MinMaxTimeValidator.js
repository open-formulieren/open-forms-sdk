import moment from 'moment';

const validateTimeBoundaries = (minBoundary, maxBoundary, timeValue) => {
  const minTime = minBoundary ? moment(minBoundary, 'HH:mm:ss') : null;
  const maxTime = maxBoundary ? moment(maxBoundary, 'HH:mm:ss') : null;
  const parsedValue = moment(timeValue, 'HH:mm:ss');

  // Case 0: no boundaries given
  if (!minTime && !maxTime) {
    return true;
  }

  // Case 1: only one boundary is given
  if (!minTime || !maxTime) {
    if (minTime) return parsedValue >= minTime;
    if (maxTime) return parsedValue < maxTime;
  } else {
    // Case 2: min boundary is smaller than max boundary
    if (minTime < maxTime) {
      return parsedValue >= minTime && parsedValue < maxTime;
    } else {
      // Case 3: min boundary is bigger than max boundary (it's the next day. For example min = 08:00, max = 01:00)
      return !(parsedValue >= maxTime && parsedValue < minTime);
    }
  }
};

const MinMaxTimeValidator = {
  key: 'validate.timeMinMax',
  message(component) {
    const minTime = moment(component.component.minTime || '00:00:00', 'HH:mm:ss').format('HH:mm');
    const maxTime = moment(component.component.maxTime || '23:59:59', 'HH:mm:ss').format('HH:mm');

    const customErrorMessage = component.component.errors?.invalidTime;
    if (customErrorMessage)
      return component.t(customErrorMessage, {
        minTime: minTime,
        maxTime: maxTime,
      });

    return component.t('invalid_time', {
      minTime: minTime,
      maxTime: maxTime,
    });
  },
  check(component, setting, value) {
    if (!value) return true;

    return validateTimeBoundaries(component.component.minTime, component.component.maxTime, value);
  },
};

export default MinMaxTimeValidator;
