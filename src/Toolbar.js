import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { applyPrefix } from './formio/utils';


const ToolbarList = ({ children }) => {
  return (
    <ul className={applyPrefix('toolbar__list')}>
      { React.Children.map(children, child => (
        <li className={applyPrefix('toolbar__list-item')}>
          {child}
        </li>
      )) }
    </ul>
  );
};

ToolbarList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};


const Toolbar = ({ children, modifiers=[] }) => {

  const className = classNames(
    applyPrefix('toolbar'),
    ...modifiers.map(mod => applyPrefix(`toolbar--${mod}`)),
  );

  return (
    <div className={className}>
      {children}
    </div>
  );
};

Toolbar.propTypes = {
    children: PropTypes.node,
    modifiers: PropTypes.arrayOf(PropTypes.string),
};


export {Toolbar, ToolbarList};
