import React from 'react';
import PropTypes from 'prop-types';

import { FormFieldDescription } from '@utrecht/component-library-react';
import {getBEMClassName} from 'utils';


const ValidationErrors = ({ errors=[] }) => (
  <div className={getBEMClassName('errors')}>
    {
      errors.map((err, index) => (
        <FormFieldDescription status="invalid" key={index} className={getBEMClassName('message', ['error'])}>
          {err}
        </FormFieldDescription>
      ))
    }
  </div>
);

ValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};


export default ValidationErrors;
