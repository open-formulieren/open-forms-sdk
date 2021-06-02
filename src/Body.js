import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from './utils';

const Body = ({ modifiers=[], component='p', children }) => {
  const Component = `${component}`;
  const className = getBEMClassName('body', modifiers);
  return (
    <Component className={className}>{children}</Component>
  );
};

Body.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.string),
  component: PropTypes.string,
  children: PropTypes.node,
};


export default Body;
