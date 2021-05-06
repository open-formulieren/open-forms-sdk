import { PREFIX } from './constants';

/**
 * Prefix a name/string/identifier with the Open Forms specific prefix.
 */
const applyPrefix = (name) => {
  return `${PREFIX}-${name}`;
};

export { applyPrefix };
