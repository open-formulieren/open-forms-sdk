import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const HelpText = ({ children, component: Component='div' }) => (
  <Component className={getBEMClassName('help-text')}>
    {children}
  </Component>
);

HelpText.propTypes = {
  children: PropTypes.node,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
};

export default HelpText;
