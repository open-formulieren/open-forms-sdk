import PropTypes from 'prop-types';

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
    label: PropTypes.node.isRequired,
    description: PropTypes.string,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }).isRequired,
};

export default FormioCheckbox;
