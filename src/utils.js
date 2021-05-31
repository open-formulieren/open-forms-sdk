import classNames from 'classnames';

import {applyPrefix} from './formio/utils';


export const getBEMClassName = (base, modifiers=[]) => {
  const prefixedBase = applyPrefix(base);
  const prefixedModifiers = modifiers.map(mod => applyPrefix(`${base}--${mod}`));
  return classNames(prefixedBase, ...prefixedModifiers);
};
