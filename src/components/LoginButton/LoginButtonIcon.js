import PropTypes from 'prop-types';
import React from 'react';



import { getBEMClassName } from 'utils';


const LoginButtonIcon = ({identifier, logo}) => {
  if (!logo) return null;

  const {href, imageSrc, title, logoAppearance} = logo;
  return (
    <a
      // Implement CSS classname modifiers openforms-login-button-logo--{dark|light} depending on backend information
      className={getBEMClassName('login-button-logo')}
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
  // Add prop appearance with possible values dark and light to LoginButtonIcon component, which configures the modifier of the component
  // Implement CSS classname modifiers openforms-login-button-logo--{dark|light} depending on backend information
  identifier: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    href: PropTypes.string,
    logoAppearance: PropTypes.string,
  }),
};

export default LoginButtonIcon;
