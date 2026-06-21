/**
 * Upstream documentation: {@Link https://json-logic.github.io/json-logic-engine/docs/context}.
 *
 * This module contains overrides of the default json-logic-engine/JsonLogic behaviour
 * to match the evaluation result of json-logic-py.
 */
import {defaultMethods} from 'json-logic-engine';

import type {JsonLogicEngineMethod} from './types';

// used to treat null values as undefined, which adheres to the backend behaviour
export const UNDEFINED_VALUE = Symbol('undefined');

const originalVar = defaultMethods['var'].method;
export const customVar: JsonLogicEngineMethod = (key, context, above, engine) => {
  let fallback: unknown;
  if (Array.isArray(key) && typeof key[0] === 'string' && key.length > 1) {
    fallback = key[1];
    const varName = key[0];
    // lookup without default and use original, if it comes back as `null` it was either
    // present with `null` or was absent in the context - in both cases we fall back to
    // the default value
    const resolved = originalVar([varName], context, above, engine);
    if (resolved === null) return fallback;
  }

  const result = originalVar(key, context, above, engine);
  if (result === null) {
    return UNDEFINED_VALUE;
  }

  return result;
};
