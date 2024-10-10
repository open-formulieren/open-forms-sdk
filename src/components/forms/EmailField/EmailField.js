import PropTypes from 'prop-types';

import {TextField} from 'components/forms';

const EmailField = props => <TextField {...props} type="email" />;

EmailField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.oneOf(['email']),
};

export default EmailField;
