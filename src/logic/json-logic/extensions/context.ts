/**
 * Upstream documentation: {@Link https://json-logic.github.io/json-logic-engine/docs/context}.
 *
 * This module contains overrides of the default json-logic-engine/JsonLogic behaviour
 * to match the evaluation result of json-logic-py.
 */
import {defaultMethods} from 'json-logic-engine';

import type {JsonLogicEngineMethod} from './types';

const originalCat = defaultMethods['cat'].method;
const originalSubstr = defaultMethods['substr'] as (args: unknown[]) => unknown;

// json logic concerning the var operator is tricky, so we impelement this from scratch
// and not using the original var function from json-logic-engine (mimic the json-logic-py
// library in the backend)
export const customVar: JsonLogicEngineMethod = (key, context) => {
  let varName = undefined;
  let notFound = undefined;
  let hasDefault = false;

  if (Array.isArray(key)) {
    varName = key[0];

    if (key.length > 1) {
      hasDefault = true;
      notFound = key[1];
    }
  } else {
    varName = key;
  }

  if (!varName) {
    return context;
  }

  let data = context;

  for (const segment of String(varName).split('.')) {
    if (data == null) {
      return hasDefault ? notFound : undefined;
    }

    const obj = Object(data);

    if (!(segment in obj)) {
      return hasDefault ? notFound : undefined;
    }

    data = obj[segment];
  }

  if (data === null && hasDefault) {
    return notFound;
  }

  return data;
};

export const customCat: JsonLogicEngineMethod = key => {
  if (!Array.isArray(key)) {
    return originalCat(key === undefined ? null : key);
  }

  return originalCat(key.map(value => (value === undefined ? null : value)));
};

export const customSubstr: JsonLogicEngineMethod = key => {
  if (!Array.isArray(key)) {
    return originalSubstr(key);
  }

  const normalized = key.map(value => (value === undefined ? null : value));
  if (normalized[0] === null) {
    return null;
  }

  return originalSubstr(normalized);
};
