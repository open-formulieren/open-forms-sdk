import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';


const LoginButtonIcons = ({ loginOptions }) => {
  const optionsWithIcons = loginOptions.filter(option => option.logo && option.logo.imageSrc);
  return (
    <>
      {optionsWithIcons.map(option => (
        <Button
          variant="image"
          component="input"
          type="image"
          href={option.logo.href}
          src={option.logo.imageSrc}
          key={option.identifier}
        />
      ))}
    </>
  );
};


LoginButtonIcons.propTypes = {
  loginOptions: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  })).isRequired,
};

export default LoginButtonIcons;
