import {defaultMethods} from 'json-logic-engine';

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

export const customEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['=='].method
);

export const customStrictEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['==='].method
);

export const customNotEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['!='].method
);

export const customNotStrictEquals: JsonLogicEngineMethod = comparatorOverrideFactory(
  defaultMethods['!=='].method
);
