import {FormFieldDescription} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

const ValidationErrors = ({error = '', id}) => {
  if (!error) return null;
  return (
    <FormFieldDescription
      id={id}
      invalid
      className="utrecht-form-field-description--openforms-errors"
    >
      {error}
    </FormFieldDescription>
  );
};

ValidationErrors.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
};

export default ValidationErrors;
