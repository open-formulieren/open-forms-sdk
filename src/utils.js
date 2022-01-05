import classNames from 'classnames';

import {applyPrefix} from './formio/utils';


export const getFormattedDateString = (intl, dateString) => {
  if (!dateString) return '';
  return intl.formatDate(new Date(dateString));
};


export const getFormattedTimeString = (intl, dateTimeString) => {
  if (!dateTimeString) return '';
  return intl.formatTime(new Date(dateTimeString));
};


export const getBEMClassName = (base, modifiers=[]) => {
  const prefixedBase = applyPrefix(base);
  const prefixedModifiers = modifiers.map(mod => applyPrefix(`${base}--${mod}`));
  return classNames(prefixedBase, ...prefixedModifiers);
};


export const flattenComponents = (components) => {
  const flattenedComponents = components.map(component => {
    if(component.components) {
      return [component].concat(flattenComponents(component.components));
    } else if (component.columns) {
      const flattenedColumnComponents =  component.columns.map(column => {
        return [].concat(flattenComponents(column.components));
      });
      // Convert an array of arrays (one array per column) to a single array
      return [].concat.apply([], flattenedColumnComponents);
    }
    else {
      return [component];
    }
  });

  // Convert an array of arrays to a single array
  return [].concat.apply([], flattenedComponents);
};


// usage: await sleep(3000);
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
