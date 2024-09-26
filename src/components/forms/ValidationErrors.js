import {FormFieldDescription} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

const ValidationErrors = ({error = '', inputId = ''}) => {
  if (!error) return null;
  return (
    <FormFieldDescription
      id={`${inputId}-error-message`}
      invalid
      className="utrecht-form-field-description--openforms-errors"
    >
      {error}
    </FormFieldDescription>
  );
};

ValidationErrors.propTypes = {
  error: PropTypes.string,
  inputId: PropTypes.string,
};

export default ValidationErrors;
