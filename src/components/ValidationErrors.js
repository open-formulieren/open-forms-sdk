import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const ValidationErrors = ({ errors=[] }) => (
  <div className={getBEMClassName('errors')}>
    {
      errors.map((err, index) => (
        <div key={index} className={getBEMClassName('message', ['error'])}>
          {err}
        </div>
      ))
    }
  </div>
);

ValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};


export default ValidationErrors;
