import React from 'react';
import PropTypes from 'prop-types';

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


const Toolbar = ({ children }) => {
    return (
      <div className={applyPrefix('toolbar')}>
        {children}
      </div>
    );
};

Toolbar.propTypes = {
    children: PropTypes.node,
};


export {Toolbar, ToolbarList};
