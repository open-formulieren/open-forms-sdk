import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

export const LOGO_APPEARANCES = ['dark', 'light'];

const LoginButtonIcon = ({identifier, logo}) => {
  if (!logo) return null;

  const {href, imageSrc, title, appearance} = logo;
  return (
    <a
      // Implement CSS classname modifiers openforms-login-button-logo--{dark|light} depending on backend information
      className={getBEMClassName('login-button-logo', [appearance])}
      href={href}
      key={identifier}
      target="_blank"
      rel="noreferrer nofollower"
    >
      <img className={getBEMClassName('login-button-logo__image')} alt={title} src={imageSrc} />
    </a>
  );
};

LoginButtonIcon.propTypes = {
  identifier: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    href: PropTypes.string,
    appearance: PropTypes.oneOf(LOGO_APPEARANCES).isRequired,
  }),
};

export default LoginButtonIcon;
