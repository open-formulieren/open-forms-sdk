import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const FAIcon = ({
  icon,
  component: Component = 'span',
  extraClassName = '',
  modifiers = [],
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

  return <Component className={className} {...props} />;
};

FAIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['small', 'normal', 'inline'])),
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  extraClassName: PropTypes.string,
};

export default FAIcon;
