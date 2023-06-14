import PropTypes from 'prop-types';

import {TextField} from 'components/forms';

const EmailField = props => <TextField {...props} type="email" />;

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default EmailField;
