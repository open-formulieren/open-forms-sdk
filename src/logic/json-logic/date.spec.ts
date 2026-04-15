import type {JSONObject} from '@open-formulieren/types';
import {expect, test} from 'vitest';

import evaluate from './index';

test('result is serialized to ISO-8601 string', () => {
  const expression: JSONObject = {date: ['2026-03-12']};

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-12');
});

test('accepts ISO-8601 datetime string but truncates to date', () => {
  const expression: JSONObject = {date: ['2026-03-12T00:00:00+01:00']};

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-12');
});

test('greater-than comparison with ISO-8601 date strings', () => {
  const expression: JSONObject = {
    '>': [{date: '2026-03-01'}, {date: '2026-03-01'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe(false);
});

test('greater-than-equals comparison with ISO-8601 date strings', () => {
  const expression: JSONObject = {
    '>=': [{date: '2026-03-01'}, {date: '2026-03-01'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe(true);
});

test('less-than comparison with ISO-8601 date strings', () => {
  const expression: JSONObject = {
    '<': [{date: '2026-03-01'}, {date: '2026-03-01'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe(false);
});

test('less-than-equals comparison with ISO-8601 date strings', () => {
  const expression: JSONObject = {
    '<=': [{date: '2026-03-01'}, {date: '2026-03-01'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe(true);
});

test('not unary operator', () => {
  const expression = {'!': {date: '2026-03-01'}};

  const result = evaluate(expression, {});

  expect(result).toBe(false);
});

test('!! (to boolean)', () => {
  const expression = {'!!': {date: '2026-03-01'}};

  const result = evaluate(expression, {});

  expect(result).toBe(true);
});

test('and', () => {
  const expression = {and: [true, {date: '2026-03-01'}]};

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-01');
});

test('or', () => {
  const expression = {or: [false, {date: '2026-03-01'}]};

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-01');
});

// tests that both the +XX:YY offsets and Z suffix can be used interchangeably. We
// completely drop the time part and only look at the date part.
test.each(['==', '==='])(
  'equals (%s) comparison with ISO-8601 datetime strings with different UTC formats',
  (operator: string) => {
    const expression = {
      [operator]: [{date: '2026-03-01T00:00:00Z'}, {date: '2026-03-01T03:00:00+01:00'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe(true);
  }
);

test.each(['!=', '!=='])(
  'not equals (%s) comparison with ISO-8601 datetime strings with different UTC formats',
  (operator: string) => {
    const expression = {
      [operator]: [{date: '2026-03-01T23:00:00Z'}, {date: '2026-03-02T00:00:00+01:00'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe(true);
  }
);

/**
 * Test the behavour of math operations on datetime operator results.
 *
 * Many math operations don't make sense and are therefore untested / their behaviour
 * undefined, as these situations should not occur:
 *
 * - addition: date + any (except for timedeltas) -> see rdelta tests
 * - multiplication: date * any
 * - division: date / any
 * - modulo: date % any
 */
test('addition of dates throws', () => {
  const expression: JSONObject = {
    '+': [{date: '2026-03-11'}, {date: '2026-03-11'}],
  };

  expect(() => evaluate(expression, {})).toThrow();
});

test('subtraction of dates produces a delta', () => {
  const expression: JSONObject = {
    '-': [{date: '2026-03-11'}, {date: '2026-03-01'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe('P0Y0M10DT0H0M0S');
});

// technically you could mix date types here with regular numbers mixed in, but that
// doesn't make sense semantically so we ignore the case - the responsibility is still
// on the form designers to write logic rules that make sense
test('maximum of dates', () => {
  const expression: JSONObject = {
    max: [{date: '2026-03-11'}, {date: '2026-03-12'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-12');
});

test('minimum of dates', () => {
  const expression: JSONObject = {
    min: [{date: '2026-03-11'}, {date: '2026-03-12'}],
  };

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-11');
});
