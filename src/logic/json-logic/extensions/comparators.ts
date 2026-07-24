import {defaultMethods} from 'json-logic-engine';
import type {LogicEngine} from 'json-logic-engine';
import {isEqual} from 'lodash';

import {INVALID_ARGUMENTS} from './constants';
import type {JsonLogicEngineMethod} from './types';

/**
 * Factory function to wrap/override built in comparators so that our custom types
 * can be handled. Because standard comparison operations in JS are crazy and are based
 * on reference equality...
 *
 * @todo: wrap the objects with compile operation instead of just the callbacks
 */
const comparatorOverrideFactory = (original: JsonLogicEngineMethod): JsonLogicEngineMethod => {
  return (args, context, above, engine) => {
    // Convert Date instances into numbers so that they *can* be properly compared by
    // built-in comparators.
    const modifiedArgs = args.map(originalArg => {
      if (originalArg instanceof Date) {
        return originalArg.getTime();
      }
      return originalArg;
    });

    if (args.some(arg => arg === null || arg === undefined)) {
      return null;
    }

    return original(modifiedArgs, context, above, engine);
  };
};

export const customGreaterThan: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['>'].method
);

export const customGreaterThanEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['>='].method
);

export const customLessThan: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['<'].method
);

export const customLessThanEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['<='].method
);

function runOptimizedOrFallback(
  logic: unknown,
  engine: LogicEngine,
  data: unknown,
  above: unknown
) {
  if (!logic) return logic;
  if (typeof logic !== 'object') return logic;

  if (!engine.disableInterpretedOptimization && engine.optimizedMap.has(logic)) {
    const optimized = engine.optimizedMap.get(logic);
    if (typeof optimized === 'function') return optimized(data, above);
    return optimized;
  }

  return engine.run(logic, data, {above});
}

export const customEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  (args, context, above, engine): boolean => {
    // While the original implementation in json-logic-engine allows for more than two arguments,
    // the backend does not, so throw whenever it is not two.
    if (!Array.isArray(args) || args.length !== 2) throw INVALID_ARGUMENTS;

    // Backend implementation:
    // if isinstance(a, str) or isinstance(b, str):
    //     return str(a) == str(b)
    // if isinstance(a, bool) or isinstance(b, bool):
    //     return bool(a) is bool(b)
    // return a == b
    const a = runOptimizedOrFallback(args[0], engine!, context, above);
    const b = runOptimizedOrFallback(args[1], engine!, context, above);
    if (typeof a === 'string' || typeof b === 'string') {
      return String(a) === String(b);
    } else if (typeof a === 'boolean' || typeof b === 'boolean') {
      return a == b;
    }
    return isEqual(a, b);
  }
);

export const customStrictEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  (args, context, above, engine): boolean => {
    const a = runOptimizedOrFallback(args[0], engine!, context, above);
    const b = runOptimizedOrFallback(args[1], engine!, context, above);
    return isEqual(a, b);
  }
);

export const customNotEquals: JsonLogicEngineMethod = (args, context, above, engine) => {
  return !customEquals(args, context, above, engine);
};

export const customNotStrictEquals: JsonLogicEngineMethod = (args, context, above, engine) => {
  return !customStrictEquals(args, context, above, engine);
};
