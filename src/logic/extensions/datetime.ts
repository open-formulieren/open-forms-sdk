import {parseISO} from 'date-fns';

import type {JsonLogicEngineMethod} from './types';

/**
 * Converts an ISO-8601 string argument to a timezone-aware Date instance.
 *
 * We don't support additional digits - the range 0000-9999 should be sufficient for
 * our domain of operations (forms for public services).
 */
export const jsonLogicDateTime: JsonLogicEngineMethod = ([dateTimeStr]) => {
  // faulty logic can be submitted or we may already have a `Date` instance - pass through
  // anything that isn't a string.
  if (typeof dateTimeStr !== 'string') return dateTimeStr;
  return parseISO(dateTimeStr);
};
