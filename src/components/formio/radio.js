import PropTypes from 'prop-types';
import React from 'react';

import {RadioField} from 'components/forms';

const FormioRadioField = ({component: {key, label, description = '', values, validate = {}}}) => (
  <RadioField
    name={key}
    label={label}
    description={description}
    isRequired={validate.required}
    options={values}
  />
);

FormioRadioField.propTypes = {
  component: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
    values: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default FormioRadioField;
