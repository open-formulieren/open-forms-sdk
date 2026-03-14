import type {JSONObject} from '@open-formulieren/types';

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

  // backend equivalent:
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
  test('addition of durations throws', () => {
    const duration: JSONObject = {duration: 'P1M1DT1H5M'};
    const expression = {'+': [duration, duration]};

    expect(() => evaluate(expression, {})).toThrow();
  });
});

// multiplication, division, modulo, maximum and minimum are not supported
