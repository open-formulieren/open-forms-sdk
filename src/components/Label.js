import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const Label = ({ text, isRequired=false }) => {

  let className = getBEMClassName('label');
  if (isRequired) {
    className = className + ' field-required';
  }

  return (
    <label className={className}>{text}</label>
  )
};

Label.propTypes = {
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isRequired: PropTypes.bool,
};

export default Label;
