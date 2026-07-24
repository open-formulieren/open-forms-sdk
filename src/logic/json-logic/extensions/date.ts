import {parseISO} from 'date-fns';

import type {JsonLogicEngineMethod} from './types';

export class DateWithoutTime extends Date {
  static createFrom(otherDate: Date) {
    return new this(otherDate.getTime());
  }

  toJSON(): string {
    // ISO-8601 datetime, but we care only about the date part, so strip that
    const superJSON = super.toJSON();
    return superJSON.substring(0, 10);
  }
}

/**
 * Converts an ISO-8601 string argument to a timezone-aware Date instance.
 *
 * We don't support additional digits - the range 0000-9999 should be sufficient for
 * our domain of operations (forms for public services).
 */
export const jsonLogicDate: JsonLogicEngineMethod = ([dateString]) => {
  // faulty logic can be submitted or we may already have a `Date` instance - pass through
  // anything that isn't a string.
  if (typeof dateString !== 'string') return dateString;

  if (dateString === '') {
    return null;
  }

  let _dateString: string = dateString;
  // to match backend behaviour, timezone-aware datetimes are converted by looking only
  // at the (naive) date part, without converting to UTC/local timezone. So, we strip
  // the time part and replace it with UTC equivalent to match behaviour.
  const tIndex = _dateString.indexOf('T');
  if (tIndex !== -1) {
    _dateString = _dateString.substring(0, tIndex);
  }
  // add the time information to force UTC midnight on the specified (naive) date
  _dateString = `${_dateString}T00:00:00Z`;
  const parsedDate = parseISO(_dateString);
  return DateWithoutTime.createFrom(parsedDate);
};
