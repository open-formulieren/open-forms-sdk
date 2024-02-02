import PropTypes from 'prop-types';

import LoginOptionLogo from './LoginOptionLogo';

const FormattedLoginOption = PropTypes.shape({
  identifier: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  url: PropTypes.string,
  logo: LoginOptionLogo,
  isForGemachtigde: PropTypes.bool,
});

export default FormattedLoginOption;
