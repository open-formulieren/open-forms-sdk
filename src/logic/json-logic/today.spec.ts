import type {JSONObject} from '@open-formulieren/types';
import {afterEach, expect, test, vi} from 'vitest';

import {DateWithoutTime} from './extensions/date';
import evaluate from './index';

afterEach(() => {
  vi.useRealTimers();
});

test('today returns a "date" without time portion', () => {
  vi.useFakeTimers();
  // Assumes we're running Europe/Amsterdam timezone! And note that months are
  // zero-indexed in JS.
  vi.setSystemTime(new Date(2026, 2, 19, 12, 0, 0));
  const expression: JSONObject = {today: []};

  const result1 = evaluate(expression, {}, {serializeResult: false});
  expect(result1).toBeInstanceOf(DateWithoutTime);

  const result2 = evaluate(expression, {});
  expect(result2).toBe('2026-03-19');
});
