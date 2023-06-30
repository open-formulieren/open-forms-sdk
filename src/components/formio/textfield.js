import PropTypes from 'prop-types';
import React from 'react';

import {TextField} from 'components/forms';

const FormioTextField = ({
  component: {key, label, description = '', autocomplete = '', validate},
}) => (
  <TextField
    name={key}
    label={label}
    description={description}
    isRequired={validate.required}
    autoComplete={autocomplete}
  />
);

FormioTextField.propTypes = {
  component: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    autocomplete: PropTypes.string,
    validate: PropTypes.shape({
      required: PropTypes.bool,
      maxLength: PropTypes.number,
    }),
  }).isRequired,
};

export default FormioTextField;
