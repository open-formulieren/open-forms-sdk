/**
 * Upstream documentation: {@Link https://json-logic.github.io/json-logic-engine/docs/context}.
 *
 * This module contains overrides of the default json-logic-engine/JsonLogic behaviour
 * to match the evaluation result of json-logic-py.
 */
import {defaultMethods} from 'json-logic-engine';

import type {JsonLogicEngineMethod} from './types';
import {isInPath} from './utils';

// Object for treating null values (missing) in a more specific way.
// Symbol would not work in our situation because it would evaluate to [Object Object]
export const UNDEFINED_VALUE = Object.freeze({
  __jsonLogicUndefinedValue: true,
});

const originalVar = defaultMethods['var'].method;
const originalCat = defaultMethods['cat'].method;
const originalSubstr = defaultMethods['substr'] as (args: unknown[]) => unknown;

/** The following combinations are taken into account (input, rule, result):
 *
 * {someVar: null}    { var: "someVar" }	              null
 * {someVar: null}	  { var: ["someVar", "default"] }   "default"
 * {}	                {var: "someVar"}                  UNDEFINED_VALUE
 * {}                 { var: ["someVar", "default"] }   "default"
 */
export const customVar: JsonLogicEngineMethod = (key, context, above, engine) => {
  if (Array.isArray(key) && typeof key[0] === 'string') {
    const varName = key[0];

    // has default value
    if (key.length > 1) {
      const fallback = key[1];
      const result = originalVar([varName], context, above, engine);
      if (result === null) {
        return fallback;
      }
      return result;
    }

    // no default: preserve null, but detect missing
    const result = originalVar([varName], context, above, engine);
    if (result === null) {
      // lookup without default and use original, if it comes back as `null` it was either
      // present with `null` or was absent in the context
      if (isInPath(context, varName)) {
        return null;
      }

      return UNDEFINED_VALUE;
    }

    return result;
  }

  const result = originalVar(key, context, above, engine);

  return result === null ? UNDEFINED_VALUE : result;
};

export const customCat: JsonLogicEngineMethod = key => {
  if (!Array.isArray(key)) {
    return originalCat(key === UNDEFINED_VALUE ? null : key);
  }

  return originalCat(key.map(value => (value === UNDEFINED_VALUE ? null : value)));
};

export const customSubstr: JsonLogicEngineMethod = key => {
  if (!Array.isArray(key)) {
    return originalSubstr(key);
  }

  const normalized = key.map(value => (value === UNDEFINED_VALUE ? null : value));
  if (normalized[0] === null) {
    return null;
  }

  return originalSubstr(normalized);
};
