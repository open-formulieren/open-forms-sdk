import type {JSONObject} from '@open-formulieren/types';

import {TYPE} from './extensions/constants';
import evaluate from './index';

test('rdelta operator creates a specialized object', () => {
  const expression: JSONObject = {rdelta: [0, 0, 0, 12]};

  const result = evaluate(expression, {}, {serializeResult: false});

  expect(result).toEqual({
    [TYPE]: 'relativedelta',
    years: 0,
    months: 0,
    days: 0,
    hours: 12,
    minutes: 0,
    seconds: 0,
  });
});

test('rdelta minimum resolution is zero arguments', () => {
  const expression: JSONObject = {rdelta: []};

  const result = evaluate(expression, {}, {serializeResult: false});

  expect(result).toEqual({
    [TYPE]: 'relativedelta',
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

test('rdelta maximum resolution is 6 arguments', () => {
  const expression: JSONObject = {rdelta: [1, 2, 3, 4, 5, 6, 7]};

  const result = evaluate(expression, {}, {serializeResult: false});

  expect(result).toEqual({
    [TYPE]: 'relativedelta',
    years: 1,
    months: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6,
  });
});

// with supported other types, rdelta addition is sometimes commutative
describe('addition (+)', () => {
  test('addition of datetime and rdelta produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '+': [{datetime: '2026-01-12T17:00:00+01:00'}, {rdelta: [1, 1, 1, 1, 1, 1]}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2027-02-13T17:01:01.000Z');
  });

  test('addition of rdelta and datetime produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '+': [{rdelta: [1, 1, 1, 1, 1, 1]}, {datetime: '2026-01-12T17:00:00+01:00'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2027-02-13T17:01:01.000Z');
  });

  test('addition of rdeltas produces rdelta', () => {
    const expression: JSONObject = {
      '+': [{rdelta: [1, 0, 1]}, {rdelta: [-2, 1, 3, 1, 2, 3]}],
    };

    const result = evaluate(expression, {}, {serializeResult: false});

    expect(result).toEqual({
      [TYPE]: 'relativedelta',
      years: -1,
      months: 1,
      days: 4,
      hours: 1,
      minutes: 2,
      seconds: 3,
    });
  });

  test('addition with multiple rdeltas is not commutative', () => {
    // first +1 month, then +1 day
    const expression1: JSONObject = {
      '+': [{datetime: '2026-02-28T00:00:00Z'}, {rdelta: [0, 1, 0]}, {rdelta: [0, 0, 1]}],
    };
    const result1 = evaluate(expression1, {});
    expect(result1).toBe('2026-03-29T00:00:00.000Z');

    // first +1 day, then +1 month
    const expression2: JSONObject = {
      '+': [{datetime: '2026-02-28T00:00:00Z'}, {rdelta: [0, 0, 1]}, {rdelta: [0, 1, 0]}],
    };
    const result2 = evaluate(expression2, {});
    // April 1st, but this has crossed the winter -> summer time conversion!
    expect(result2).toBe('2026-03-31T23:00:00.000Z');
  });
});

describe('subtraction (-)', () => {
  test('subtraction of datetime and rdelta produces datetime', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '-': [{datetime: '2026-01-12T17:00:00+01:00'}, {rdelta: [1, 1, 1, 1, 1, 1]}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe('2024-12-11T14:58:59.000Z');
  });

  // subtraction of rdelta with datetime is not supported in the backend
  test('subtraction of rdelta and datetime throws', () => {
    const expression: JSONObject = {
      // uses a January date so that we stay in DST...
      '-': [{rdelta: [1, 1, 1, 1, 1, 1]}, {datetime: '2026-01-12T17:00:00+01:00'}],
    };

    expect(() => evaluate(expression, {})).toThrow();
  });

  test('subtraction of rdeltas produces rdelta', () => {
    const expression: JSONObject = {
      '-': [{rdelta: [2, 0, 1]}, {rdelta: [1, 1, 3, 1, 2, 3]}],
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
