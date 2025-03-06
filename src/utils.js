import clsx from 'clsx';

import {getEnv} from './env';

export {DEBUG} from './env';

const VERSION = getEnv('VERSION');

export const PREFIX = 'openforms';

export const getFormattedDateString = (intl, dateString) => {
  if (!dateString) return '';
  return intl.formatDate(new Date(dateString));
};

export const getFormattedTimeString = (intl, dateTimeString) => {
  if (!dateTimeString) return '';
  return intl.formatTime(new Date(dateTimeString));
};

/**
 * Prefix a name/string/identifier with the Open Forms specific prefix.
 */
export const applyPrefix = name => {
  return `${PREFIX}-${name}`;
};

export const getBEMClassName = (base, modifiers = []) => {
  const prefixedBase = applyPrefix(base);
  const prefixedModifiers = modifiers.map(mod => applyPrefix(`${base}--${mod}`));
  return clsx(prefixedBase, ...prefixedModifiers);
};

// usage: await sleep(3000);
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getVersion = () => VERSION || 'unknown';
