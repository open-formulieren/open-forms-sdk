import {FormFieldDescription} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

const ValidationErrors = ({error = ''}) => {
  if (!error) return null;
  return (
    <FormFieldDescription invalid className="utrecht-form-field-description--openforms-errors">
      {error}
    </FormFieldDescription>
  );
};

ValidationErrors.propTypes = {
  error: PropTypes.string,
};

export default ValidationErrors;
