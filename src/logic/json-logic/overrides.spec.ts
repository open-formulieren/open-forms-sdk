import type {JSONObject} from '@open-formulieren/types';
import {describe, expect, test} from 'vitest';

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

describe.each(['>', '>=', '<', '<=', '+', '-', '*', '/', '%', 'min', 'max'])(
  '%s operator',
  operator => {
    test.each([
      ['undefined', undefined],
      ['null', null],
    ])('returns null with %s', (_, value: null | undefined) => {
      // @ts-expect-error undefined is not part of the JSONObject type, but we're testing
      // the behaviour here
      const expression: JSONObject = {
        [operator]: [value, 8],
      };

      expect(evaluate(expression, {})).toBeNull();
    });
  }
);
