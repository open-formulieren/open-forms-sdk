import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';

const LoginButtonIcon = ({ identifier, logo: { href, imageSrc } }) => (
  <Button
    variant="image"
    component="input"
    type="image"
    href={href}
    src={imageSrc}
    key={identifier}
  />
);

LoginButtonIcon.propTypes = {
  identifier: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    href: PropTypes.string,
  }),
};

export default LoginButtonIcon;
