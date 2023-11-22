import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

const Caption = ({children, id, component = 'caption'}) => {
  const Component = `${component}`;
  return (
    <Component id={id} className={getBEMClassName('caption')}>
      {children}
    </Component>
  );
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Caption;
