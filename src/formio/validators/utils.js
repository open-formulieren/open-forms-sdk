import {parseISO} from 'date-fns';

export const validateBoundaries = (componentType, minBoundary, maxBoundary, value) => {
  const parsedMinBoundary = minBoundary ? new Date(minBoundary) : null;
  const parsedMaxBoundary = maxBoundary ? new Date(maxBoundary) : null;

  if (!parsedMinBoundary && !parsedMaxBoundary) {
    return {isValid: true};
  }

  const parsedValue = parseISO(value);

  let errorKeyMinValue, errorKeyMaxValue;
  if (componentType === 'date') {
    errorKeyMinValue = 'minDate';
    errorKeyMaxValue = 'maxDate';
  } else if (componentType === 'datetime') {
    errorKeyMinValue = 'minDatetime';
    errorKeyMaxValue = 'maxDatetime';
  }

  if (parsedMinBoundary && parsedMaxBoundary) {
    const isValid = parsedValue >= parsedMinBoundary && parsedValue <= parsedMaxBoundary;
    let errorKeys = [];
    if (!isValid) {
      if (parsedValue < parsedMinBoundary) {
        errorKeys.push(errorKeyMinValue);
      } else {
        errorKeys.push(errorKeyMaxValue);
      }
    }
    return {isValid, errorKeys};
  }

  if (parsedMinBoundary)
    return {isValid: parsedValue >= parsedMinBoundary, errorKeys: [errorKeyMinValue]};
  if (parsedMaxBoundary)
    return {isValid: parsedValue <= parsedMaxBoundary, errorKeys: [errorKeyMaxValue]};
};
