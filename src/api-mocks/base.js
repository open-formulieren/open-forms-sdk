import {getEnv} from 'env';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const BASE_URL = getEnv('BASE_API_URL') || 'http://localhost:8000/api/v2/';

/**
 * Create a function to build an object from a default with optional overrides.
 * @param  {Object} default_object The default object to optionally apply overrides to.
 * @return {Function}              A function taking an optional overrides object which
 *                                 produces a final object for use in tests/mocks.
 */
export const getDefaultFactory = default_object => {
  /**
   * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
   *                            are deep-assigned via lodash.set to the defaults, so use
   *                            '.'-joined strings as keys for deep paths.
   * @return {Object}           An object conforming to the shape of the default object
   *                            with overrides applied. The object has no shallow copies
   *                            or references to the "seed" object.
   */
  return (overrides = {}) => {
    const obj = cloneDeep(default_object);
    for (const [key, value] of Object.entries(overrides)) {
      set(obj, key, value);
    }
    return obj;
  };
};
