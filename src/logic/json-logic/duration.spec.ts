import type {JSONObject} from '@open-formulieren/types';
import {describe, expect, test} from 'vitest';

import {TYPE} from './extensions/constants';
import evaluate from './index';

test('duration operator creates a specialized object', () => {
  const expression: JSONObject = {duration: 'P1M'};

  const result = evaluate(expression, {}, {serializeResult: false});

  expect(result).toEqual({
    [TYPE]: 'relativedelta',
    years: 0,
    months: 1,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('duration operator serializes to duration string', () => {
  const expression: JSONObject = {duration: 'P1M'};

  const result = evaluate(expression, {});

  expect(result).toBe('P0Y1M0DT0H0M0S');
});

describe('addition (+)', () => {
  test('addition of datetime and duration produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '+': [{datetime: '2023-01-01T10:00:00+01:00'}, {duration: 'P1M1DT1H5M'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2023-02-02T10:05:00.000Z');
  });

  test('addition of duration and datetime produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '+': [{duration: 'P1M1DT1H5M'}, {datetime: '2023-01-01T10:00:00+01:00'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2023-02-02T10:05:00.000Z');
  });

  test('addition with multiple durations is not commutative', () => {
    const addOneMonth: JSONObject = {duration: 'P1M'};
    const addOneDay: JSONObject = {duration: 'P1D'};

    // first +1 month, then +1 day
    const expression1: JSONObject = {
      '+': [{datetime: '2026-02-28T00:00:00Z'}, addOneMonth, addOneDay],
    };
    const result1 = evaluate(expression1, {});
    expect(result1).toBe('2026-03-29T00:00:00.000Z');

    // first +1 day, then +1 month
    const expression2: JSONObject = {
      '+': [{datetime: '2026-02-28T00:00:00Z'}, addOneDay, addOneMonth],
    };
    const result2 = evaluate(expression2, {});
    // April 1st, but this has crossed the winter -> summer time conversion!
    expect(result2).toBe('2026-03-31T23:00:00.000Z');
  });

  // the backend equivalent errors:
  // >>> jsonLogic({"+": [duration, duration]})
  // Traceback (most recent call last):
  //   File "<stdin>", line 1, in <module>
  //   File "~/.virtualenvs/open-forms/lib/python3.12/site-packages/json_logic/__init__.py", line 325, in jsonLogic
  //     return operations[operator](*values)
  //            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //   File "~/.virtualenvs/open-forms/lib/python3.12/site-packages/json_logic/__init__.py", line 95, in plus
  //     return sum(to_numeric(arg) for arg in args)
  //            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //   File "~/.virtualenvs/open-forms/lib/python3.12/site-packages/isodate/duration.py", line 187, in __add__
  //     newduration.tdelta = self.tdelta + other
  //                          ~~~~~~~~~~~~^~~~~~~
  // TypeError: unsupported operand type(s) for +: 'datetime.timedelta' and 'int'
  test('addition of durations', () => {
    const duration: JSONObject = {duration: 'P1M1DT1H5M'};
    const expression = {'+': [duration, duration]};

    // this doesn't crash because we normalize to relativedelta objects internally,
    // which *can* be added
    expect(() => evaluate(expression, {})).not.toThrow();
  });
});

describe('subtraction (-)', () => {
  test('subtraction of datetime and duration produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '-': [{datetime: '2026-01-12T17:00:00+01:00'}, {duration: 'P1Y1M1DT1H1M1S'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2024-12-11T14:58:59.000Z');
  });

  // subtraction of duration with datetime is not supported in the backend
  test('subtraction of duration and datetime throws', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '-': [{duration: 'P1Y1M1DT1H1M1S'}, {datetime: '2026-01-12T17:00:00+01:00'}],
    };

    expect(() => evaluate(expression, {})).toThrow();
  });

  // the backend equivalent errors - it probably shouldn't?
  test('subtraction of durations produces duration', () => {
    const expression: JSONObject = {
      '-': [{duration: 'P2Y0M1D'}, {duration: 'P1Y1M3DT1H2M3S'}],
    };

    const result = evaluate(expression, {}, {serializeResult: false});

    expect(result).toEqual({
      [TYPE]: 'relativedelta',
      years: 1,
      months: -1,
      days: -2,
      hours: -1,
      minutes: -2,
      seconds: -3,
    });
  });
});

// multiplication, division, modulo, maximum and minimum are not supported
