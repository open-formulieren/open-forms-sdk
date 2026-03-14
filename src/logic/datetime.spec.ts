import type {JSONObject} from '@open-formulieren/types';

import evaluate from './index';

test.each([
  '2026-03-12T12:34:56.000+01:00',
  '2026-03-12T12:34:56+01:00',
  '2026-03-12T11:34:56+00:00',
  '2026-03-12T11:34:56Z',
])('result is serialized to ISO-8601 string', (inputDate: string) => {
  const expression: JSONObject = {datetime: [inputDate]};

  const result = evaluate(expression, {});

  expect(result).toBe('2026-03-12T11:34:56.000Z');
});

test('greater-than comparison with ISO-8601 datetime strings with different timezone offsets', () => {
  const expression: JSONObject = {
    '>': [{datetime: {var: 'someDatetime'}}, {datetime: '2026-03-01T12:00:00+01:00'}],
  };
  const data = {someDatetime: '2026-03-01T11:00:01+00:00'};

  const result = evaluate(expression, data);

  expect(result).toBe(true);
});

test('greater-than-equals comparison with ISO-8601 datetime strings with different timezone offsets', () => {
  const expression: JSONObject = {
    '>=': [{datetime: {var: 'someDatetime'}}, {datetime: '2026-03-01T12:00:00+01:00'}],
  };
  const data = {someDatetime: '2026-03-01T11:00:00+00:00'};

  const result = evaluate(expression, data);

  expect(result).toBe(true);
});

test('less-than comparison with ISO-8601 datetime strings with different timezone offsets', () => {
  const expression: JSONObject = {
    '<': [{datetime: {var: 'someDatetime'}}, {datetime: '2026-03-01T12:00:00+01:00'}],
  };
  const data = {someDatetime: '2026-03-01T11:00:00+00:00'};

  const result = evaluate(expression, data);

  expect(result).toBe(false);
});

test('less-than-equals comparison with ISO-8601 datetime strings with different timezone offsets', () => {
  const expression: JSONObject = {
    '<=': [{datetime: {var: 'someDatetime'}}, {datetime: '2026-03-01T12:00:00+01:00'}],
  };
  const data = {someDatetime: '2026-03-01T11:00:00+00:00'};

  const result = evaluate(expression, data);

  expect(result).toBe(true);
});

test.each(['not', '!'])('not unary operator', (operator: string) => {
  const expression = {[operator]: {datetime: '2026-03-01T12:00:00+01:00'}};

  const result = evaluate(expression, {});

  expect(result).toBe(false);
});

test('!! (to boolean)', () => {
  const expression = {'!!': {datetime: '2026-03-01T12:00:00+01:00'}};

  const result = evaluate(expression, {});

  expect(result).toBe(true);
});

test('and', () => {
  const expression = {and: [true, {datetime: '2026-03-01T12:00:00+01:00'}]};

  // without serialization
  const result1 = evaluate(expression, {}, {serializeResult: false});
  expect(result1).toBeInstanceOf(Date);

  // with serialization
  const result2 = evaluate(expression, {}, {serializeResult: true});
  expect(result2).toBe('2026-03-01T11:00:00.000Z');
});

test('or', () => {
  const expression = {or: [false, {datetime: '2026-03-01T12:00:00+01:00'}]};

  // without serialization
  const result1 = evaluate(expression, {}, {serializeResult: false});
  expect(result1).toBeInstanceOf(Date);

  // with serialization
  const result2 = evaluate(expression, {}, {serializeResult: true});
  expect(result2).toBe('2026-03-01T11:00:00.000Z');
});

// tests that both the +XX:YY offsets and Z suffix can be used interchangeably
test.each(['==', '==='])(
  'equals (%s) comparison with ISO-8601 datetime strings with different UTC formats',
  (operator: string) => {
    const expression = {
      [operator]: [{datetime: '2026-03-01T12:00:00+00:00'}, {datetime: '2026-03-01T12:00:00Z'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe(true);
  }
);

test.each(['!=', '!=='])(
  'not equals (%s) comparison with ISO-8601 datetime strings with different UTC formats',
  (operator: string) => {
    const expression = {
      [operator]: [{datetime: '2026-03-01T12:00:00+00:00'}, {datetime: '2026-03-01T12:00:00Z'}],
    };

    const result = evaluate(expression, {});

    expect(result).toBe(false);
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
test('addition of datetimes throws', () => {
  const expression: JSONObject = {
    '+': [{datetime: '2026-03-11T18:30:00+01:00'}, {datetime: '2026-03-11T18:00:00+01:00'}],
  };

  expect(() => evaluate(expression, {})).toThrow();
});

test('subtraction of datetimes produces a delta', () => {
  const expression: JSONObject = {
    '-': [{datetime: '2026-03-11T18:30:00+01:00'}, {datetime: '2026-03-11T18:00:00+01:00'}],
  };

  const result = evaluate(expression, {});

  expect(result).toEqual({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 30,
    seconds: 0,
  });
});

test('subtraction of datetimes translates weeks into days', () => {
  const expression: JSONObject = {
    '-': [{datetime: '2026-03-18T18:00:00+01:00'}, {datetime: '2026-03-11T18:00:00+01:00'}],
  };

  const result = evaluate(expression, {});

  expect(result).toEqual({
    years: 0,
    months: 0,
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});

// technically you could mix date types here with regular numbers mixin in, but that
// doesn't make sense semantically so we ignore the case - the responsibility is still
// on the form designers to write logic rules that make sense
test('maximum of datetimes', () => {
  const expression: JSONObject = {
    max: [{datetime: '2026-03-11T18:00:00+01:00'}, {datetime: '2026-03-11T17:01:00Z'}],
  };

  const result = evaluate(expression, {});

  // 17:01 UTC > 17:00 UTC (18:00 +0100)
  expect(result).toBe('2026-03-11T17:01:00.000Z');
});

test('minimum of datetimes', () => {
  const expression: JSONObject = {
    min: [{datetime: '2026-03-11T18:00:00+01:00'}, {datetime: '2026-03-11T17:01:00Z'}],
  };

  const result = evaluate(expression, {});

  // 17:01 UTC > 17:00 UTC (18:00 +0100)
  expect(result).toBe('2026-03-11T17:00:00.000Z');
});
