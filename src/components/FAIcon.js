import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// not all icons need to be seen by assistive technologies.
const FAIcon = ({
  icon,
  component: Component = 'i',
  extraClassName = '',
  modifiers = [],
  noAriaHidden = false,
  ...props
}) => {
  const className = classNames(
    'fa',
    'fas',
    'fa-icon',
    `fa-${icon}`,
    ...modifiers.map(mod => `fa-icon--${mod}`),
    extraClassName
  );
  const ariaHidden = noAriaHidden ? 'false' : 'true';
  return <Component className={className} aria-hidden={ariaHidden} {...props} />;
};

FAIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['small', 'normal', 'inline'])),
  noAriaHidden: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  extraClassName: PropTypes.string,
};

export default FAIcon;
