import {add, intervalToDuration, sub} from 'date-fns';
import {defaultMethods} from 'json-logic-engine';

import {INVALID_ARGUMENTS, TYPE} from './constants';
import {isRelativeDelta, subtractDeltas, sumDeltas} from './rdelta';
import type {RelativeDelta} from './rdelta';
import type {JsonLogicEngineMethod} from './types';

/**
 * Custom addition implementation handles our custom data types introduced with the
 * custom operators.
 */
export const customAddition: JsonLogicEngineMethod = args => {
  const original = defaultMethods['+'];

  // check for any rdeltas - if there are some, there are two modes:
  // - no dates present, sum all the rdeltas into one (matching the
  //   dateutil.relativedelta behaviour in python)
  // - if a date is present, calculate the resulting date
  const rdeltas = args.filter(arg => isRelativeDelta(arg));
  const dates = args.filter(arg => arg instanceof Date);

  if (rdeltas.length) {
    // all of them are rdeltas
    if (rdeltas.length == args.length) {
      return sumDeltas(rdeltas);
    }

    // we now expect exactly one Date instance
    if (dates.length !== 1) throw INVALID_ARGUMENTS;
    // we expect all args to be: 1 date, one or more rdeltas. Any other types don't make
    // sense.
    if (args.length !== rdeltas.length + 1) throw INVALID_ARGUMENTS;

    // rdeltas combined with dates are not commutative, so we must preserve the order.
    // however, we do have to extract the date instance to the start and build from
    // there.
    return rdeltas.reduce((acc, rdelta) => add(acc, rdelta), dates[0]);
  }

  // if there are multiple dates, we can't do anything meaningful
  if (dates.length >= 2) throw INVALID_ARGUMENTS;

  return original(args);
};

/**
 * Custom subtraction implementation handles our custom data types introduced with the
 * custom operators.
 */
export const customSubtraction: JsonLogicEngineMethod = args => {
  const original = defaultMethods['-'];

  // check for any rdeltas - if there are some, there are two modes:
  // - no dates present, sum all the rdeltas into one (matching the
  //   dateutil.relativedelta behaviour in python)
  // - if a date is present, calculate the resulting date
  const rdeltas = args.filter(arg => isRelativeDelta(arg));

  if (rdeltas.length) {
    // all of them are rdeltas
    if (rdeltas.length == args.length) {
      if (rdeltas.length < 2) throw INVALID_ARGUMENTS;
      return subtractDeltas(rdeltas);
    }

    // not all of them are deltas. we now expect the first argument to be a Date and
    // the others a relativedelta. Subtracting a date from a relativedelta is not
    // supported
    if (!(args[0] instanceof Date)) throw INVALID_ARGUMENTS;

    // subtract all the provided rdeltas from the date
    return rdeltas.reduce((acc, rdelta) => sub(acc, rdelta), args[0]);
  }

  // subtracting dates produces a relativedelta, but only if we have exactly two dates
  const dates = args.filter(arg => arg instanceof Date);
  if (dates.length) {
    if (dates.length != 2) throw INVALID_ARGUMENTS;
    const [end, start] = dates;
    // NOTE: weeks is ignored here
    const {
      years = 0,
      months = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = intervalToDuration({start, end});
    const result: RelativeDelta = {
      [TYPE]: 'relativedelta',
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
    };
    return result;
  }

  return original(args);
};

const customMinMaxFactory = (
  original: JsonLogicEngineMethod<number>
): JsonLogicEngineMethod<number | Date> => {
  return (args: unknown[]) => {
    // if there are dates, convert them into something comparable, call the original and
    // map back to the date instance
    const dates = args.filter(arg => arg instanceof Date);
    if (dates.length) {
      const timesToDate: Record<number, Date> = {};
      const modifiedArgs = args.map(originalArg => {
        if (originalArg instanceof Date) {
          const time = originalArg.getTime();
          timesToDate[time] = originalArg;
          return time;
        }
        return originalArg;
      });

      const result = original(modifiedArgs);
      // if non-Date arguments were mixed in, they key access may be undefined - just
      // return the originalArg instead then
      return timesToDate?.[result] ?? result;
    }

    return original(args);
  };
};

export const customMaximum = customMinMaxFactory(defaultMethods['max']);
export const customMinimum = customMinMaxFactory(defaultMethods['min']);
