import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

const LoginButtonIcon = ({identifier, logo}) => {
  if (!logo) return null;

  const {href, imageSrc, title} = logo;
  return (
    <a
      className={getBEMClassName('login-button-logo')}
      href={href}
      key={identifier}
      onClick={event => {
        event.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }}
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
  }),
};

export default LoginButtonIcon;
