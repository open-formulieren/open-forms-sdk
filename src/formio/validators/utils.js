import {parseISO} from 'date-fns';

/**
 * Validate a date or datetime value against min and max boundaries.
 * This function can be used for both the date and datetime component,
 * as the error keys are the same for both.
 */
export const validateBoundaries = (minBoundary, maxBoundary, value) => {
  const parsedMinBoundary = minBoundary ? parseISO(minBoundary) : null;
  const parsedMaxBoundary = maxBoundary ? parseISO(maxBoundary) : null;

  if (!parsedMinBoundary && !parsedMaxBoundary) {
    return {isValid: true};
  }

  const parsedValue = parseISO(value);

  const validInfo = {isValid: true};

  if (parsedMinBoundary && parsedValue < parsedMinBoundary) {
    validInfo.isValid = false;
    validInfo.errorKey = 'minDate';
  }
  if (parsedMaxBoundary && parsedValue > parsedMaxBoundary) {
    validInfo.isValid = false;
    validInfo.errorKey = 'maxDate';
  }
  return validInfo;
};
