import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const HelpText = ({ text }) => {

  return (
    <p className={getBEMClassName('help-text')}>{text}</p>
  )
};

HelpText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default HelpText;
