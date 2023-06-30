import PropTypes from 'prop-types';
import React from 'react';

import {EmailField} from 'components/forms';

const FormioEmailField = ({
  component: {key, label, description = '', autocomplete = '', validate},
}) => (
  <EmailField
    name={key}
    label={label}
    description={description}
    isRequired={validate.required}
    autoComplete={autocomplete}
  />
);

FormioEmailField.propTypes = {
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

export default FormioEmailField;
