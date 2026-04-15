import type {JSONObject} from '@open-formulieren/types';
import {expect, test} from 'vitest';

import evaluate from './index';

// by default, the var default fallback is only used if the key is not present in the
// data, but the backend falls back even for `None` and behaviour must be aligned
// between backend and frontend
test.each([null, undefined])(
  'var default fallback used even for null (input: %s)',
  (value: null | undefined) => {
    const expression: JSONObject = {var: ['a', 1]};
    const data: JSONObject = value === undefined ? {} : {a: value};

    const result = evaluate(expression, data);

    expect(result).toBe(1);
  }
);

test.each([
  [{'+': [null, 5]}],
  [{'-': [null, 5]}],
  [{'*': [null, 5]}],
  [{'/': [null, 5]}],
  [{'%': [null, 5]}],
  [{min: [null, 5]}],
  [{max: [null, 5]}],
])('math with null-ish values short-circuits, expression: %o', (expression: JSONObject) => {
  const result = evaluate(expression, {});

  expect(result).toBe(null);
});
