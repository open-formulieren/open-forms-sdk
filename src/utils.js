import classNames from 'classnames';

import {getEnv} from './env';
import {applyPrefix} from './formio/utils';

export {DEBUG} from './env';

const VERSION = getEnv('VERSION');

export const getFormattedDateString = (intl, dateString) => {
  if (!dateString) return '';
  return intl.formatDate(new Date(dateString));
};

export const getFormattedTimeString = (intl, dateTimeString) => {
  if (!dateTimeString) return '';
  return intl.formatTime(new Date(dateTimeString));
};

export const getBEMClassName = (base, modifiers = []) => {
  const prefixedBase = applyPrefix(base);
  const prefixedModifiers = modifiers.map(mod => applyPrefix(`${base}--${mod}`));
  return classNames(prefixedBase, ...prefixedModifiers);
};

// usage: await sleep(3000);
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getVersion = () => VERSION || 'unknown';
