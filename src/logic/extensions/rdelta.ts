import {INVALID_ARGUMENTS, TYPE} from './constants';
import type {JsonLogicEngineMethod} from './types';

export interface RelativeDelta {
  [TYPE]: 'relativedelta';
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function isRelativeDelta(arg: unknown): arg is RelativeDelta {
  if (typeof arg !== 'object' || arg == null) return false;
  if (!(TYPE in arg)) return false;
  return arg[TYPE] === 'relativedelta';
}

/**
 * Converts an array of arguments to a `relativedelta` object.
 *
 * We use an object that can be introspected on it's `TYPE` symbol so that it's clear
 * how operations involving it must behave.
 *
 * @deprecated This is the predecessor to the `duration` operator, which is string-based.
 */
export const jsonLogicRelativeDelta: JsonLogicEngineMethod = (args): RelativeDelta => {
  if (!args.every(arg => typeof arg === 'number')) throw INVALID_ARGUMENTS;
  const [years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0] = args;
  return {
    [TYPE]: 'relativedelta',
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

const RDELTA_KEYS = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
] satisfies (keyof RelativeDelta)[];

/**
 * Add all the provided deltas together into one.
 */
export const sumDeltas = (rdeltas: RelativeDelta[]) => {
  const initial: RelativeDelta = {
    [TYPE]: 'relativedelta',
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  const result: RelativeDelta = rdeltas.reduce((acc, rdelta) => {
    for (const key of RDELTA_KEYS) {
      acc[key] += rdelta[key];
    }
    return acc;
  }, initial);
  return result;
};

/**
 * Subtract all the provided deltas together into one.
 */
export const subtractDeltas = (rdeltas: RelativeDelta[]) => {
  if (rdeltas.length < 2) throw new Error('You must provide at least 2 deltas');
  const [head, ...rest] = rdeltas;
  const result: RelativeDelta = rest.reduce((acc, rdelta) => {
    for (const key of RDELTA_KEYS) {
      acc[key] -= rdelta[key];
    }
    return acc;
  }, head);
  return result;
};
