/**
 * Upstream documentation: {@Link https://json-logic.github.io/json-logic-engine/docs/context}.
 *
 * This module contains overrides of the default json-logic-engine/JsonLogic behaviour
 * to match the evaluation result of json-logic-py.
 */
import type {JSONValue} from '@open-formulieren/types';
import {defaultMethods} from 'json-logic-engine';

import type {JsonLogicEngineMethod} from './types';

// json logic concerning the var operator is tricky, so we implement this from scratch
// and not using the original var function from json-logic-engine (mimic the json-logic-py
// library in the backend)
export const customVar: JsonLogicEngineMethod = (key, context) => {
  let varName: JSONValue | undefined;
  let defaultValue: JSONValue | undefined = undefined;

  if (Array.isArray(key)) {
    [varName, defaultValue] = key as [JSONValue, JSONValue] | [JSONValue] | [];
  } else {
    varName = key;
  }

  if (!varName) {
    return context;
  }

  let data = context;

  for (const segment of String(varName).split('.')) {
    if (data === null) {
      return defaultValue;
    }

    const obj = Object(data);

    if (!(segment in obj)) {
      return defaultValue;
    }

    data = obj[segment];
  }

  if (data === null && defaultValue) {
    return defaultValue;
  }

  return data;
};

export const customCat: JsonLogicEngineMethod = key => {
  const originalCat = defaultMethods['cat'].method;

  if (!Array.isArray(key)) {
    return originalCat(key === undefined ? null : key);
  }

  return originalCat(key.map(value => (value === undefined ? null : value)));
};

export const customSubstr: JsonLogicEngineMethod = key => {
  const originalSubstr = defaultMethods['substr'] as (args: unknown[]) => unknown;

  if (!Array.isArray(key)) {
    return originalSubstr(key);
  }

  const normalized = key.map(value => (value === undefined ? null : value));
  if (normalized[0] === null) {
    return null;
  }

  return originalSubstr(normalized);
};
