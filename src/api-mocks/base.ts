import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import {getEnv} from '@/env';

export const BASE_URL = getEnv('BASE_API_URL') || 'http://localhost:8000/api/v2/';

/**
 * Create a function to build an object from a default with optional overrides.
 * @param  default_object The default object to optionally apply overrides to.
 * @return A function taking an optional overrides object which produces a final object
 *         for use in tests/mocks.
 */
export const getDefaultFactory = <T extends object>(default_object: NoInfer<T>) => {
  /**
   * @param  overrides Key-value mapping with overrides from the defaults. These
   *                            are deep-assigned via lodash.set to the defaults, so use
   *                            '.'-joined strings as keys for deep paths.
   * @return  An object conforming to the shape of the default object
   *          with overrides applied. The object has no shallow copies
   *          or references to the "seed" object.
   */
  return (overrides: Partial<T> = {}): T => {
    const obj = cloneDeep(default_object);
    for (const [key, value] of Object.entries(overrides)) {
      set(obj, key, value);
    }
    return obj;
  };
};
