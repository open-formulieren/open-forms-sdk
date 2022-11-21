import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {getBEMClassName} from 'utils';

const Label = ({children, isRequired = false}) => {
  const className = classNames(getBEMClassName('label'), {'field-required': isRequired});

  return <label className={className}>{children}</label>;
};

Label.propTypes = {
  children: PropTypes.node,
  isRequired: PropTypes.bool,
};

export default Label;
