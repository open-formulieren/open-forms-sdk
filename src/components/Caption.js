import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

const Caption = ({children, component = 'caption'}) => {
  const Component = `${component}`;
  return <Component className={getBEMClassName('caption')}>{children}</Component>;
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Caption;
