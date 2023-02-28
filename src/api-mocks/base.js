import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const BASE_URL = process.env.REACT_APP_BASE_API_URL || 'http://localhost:8000/api/v2/';

export const getDefaultFactory = default_object => {
  /**
   * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
   *                            are deep-assigned via lodash.set to the defaults, so use
   *                            '.'-joined strings as keys for deep paths.
   * @return {Object}           A form detail object conforming to the Form proptype spec.
   */
  const defaultFactory = (overrides = {}) => {
    const obj = cloneDeep(default_object);
    for (const [key, value] of Object.entries(overrides)) {
      set(obj, key, value);
    }
    return obj;
  };
  return defaultFactory;
};
