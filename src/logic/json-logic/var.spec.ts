import type {JSONObject} from '@open-formulieren/types';
import {expect, test} from 'vitest';

import evaluate from './index';

test('evaluate with existing variable', () => {
  const expression: JSONObject = {var: 'a'};
  const data: JSONObject = {a: 3};

  const result = evaluate(expression, data);

  expect(result).toBe(3);
});

test('evaluate with empty data', () => {
  const expression: JSONObject = {var: 'a'};
  const data: JSONObject = {};

  const result = evaluate(expression, data);

  expect(result).toBeUndefined();
});

test('evaluate with variable null', () => {
  const expression: JSONObject = {var: 'a'};
  const data: JSONObject = {a: null};

  const result = evaluate(expression, data);

  expect(result).toBeNull();
});

test('evaluate with default value and empty data', () => {
  const expression: JSONObject = {var: [3, 5]};
  const data: JSONObject = {a: null};

  const result = evaluate(expression, data);

  expect(result).toBe(5);
});

test('evaluate with nested variable', () => {
  const expression: JSONObject = {var: 'a.b'};
  const data: JSONObject = {a: {b: 3}};

  const result = evaluate(expression, data);

  expect(result).toBe(3);
});

test('evaluate array of values', () => {
  const expression: JSONObject = {var: 'a.1'};
  const data: JSONObject = {a: [3, 5]};

  const result = evaluate(expression, data);

  expect(result).toBe(5);
});
