import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from '../../utils';

// FIXME: this really should not be a <input type="image" />, it completely violates
// the semantics and expectations of how it should be used: as an actual form submit
// button styled with an image.
//
// This should be a regular anchor with a href that opens in a new window/tab,
// having the icon/logo as graphical representation as it is contextual.
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/image does not even
// document the href attribute.

const LoginButtonIcon = ({identifier, logo: {href, imageSrc, title}}) => (
  <input
    className={getBEMClassName('button', ['image'])}
    type="image"
    href={href}
    alt={title}
    src={imageSrc}
    key={identifier}
    onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
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
