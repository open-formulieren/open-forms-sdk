import PropTypes from 'prop-types';
import React from 'react';

import {DateField} from 'components/forms';

const FormioDateField = ({
  component: {key, label, description = '', autocomplete = '', validate, openForms},
}) => (
  <DateField
    name={key}
    label={label}
    description={description}
    isRequired={validate.required}
    autoComplete={autocomplete}
    widget={openForms?.widget ?? 'inputGroup'}
  />
);

FormioDateField.propTypes = {
  component: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    autocomplete: PropTypes.string,
    validate: PropTypes.shape({
      required: PropTypes.bool,
      maxLength: PropTypes.number,
    }),
    openForms: PropTypes.shape({
      widget: PropTypes.oneOf(['datepicker', 'inputGroup']),
    }),
  }).isRequired,
};

export default FormioDateField;
