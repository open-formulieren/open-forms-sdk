import PropTypes from 'prop-types';

import {LOGO_APPEARANCES} from 'components/LoginButton/LoginButtonIcon';

const LoginOptionLogo = PropTypes.shape({
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  href: PropTypes.string,
  appearance: PropTypes.oneOf(LOGO_APPEARANCES),
});

export default LoginOptionLogo;
