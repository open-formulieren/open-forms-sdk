import PropTypes from 'prop-types';
import React from 'react';

import {Checkbox} from 'components/forms';

const FormioCheckbox = ({component: {key, label, description = '', validate = {}}}) => (
  <Checkbox
    name={key}
    label={label}
    description={description}
    isRequired={validate?.required ?? false}
  />
);

FormioCheckbox.propTypes = {
  component: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }).isRequired,
};

export const emptyValue = false;

export default FormioCheckbox;
