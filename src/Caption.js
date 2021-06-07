import React from 'react';
import PropTypes from 'prop-types';

import {applyPrefix} from './formio/utils';


const Caption = ({ children, component='caption' }) => {
  const Component = `${component}`;
  return (
    <Component className={applyPrefix('caption')}>{children}</Component>
  );
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Caption;
