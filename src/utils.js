import classNames from 'classnames';

import {applyPrefix} from './formio/utils';

export const DEBUG = process.env.NODE_ENV === 'development';
const {REACT_APP_VERSION} = process.env;

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

export const getVersion = () => {
  return REACT_APP_VERSION || 'unknown';
};
