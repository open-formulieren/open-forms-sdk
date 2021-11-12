import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const FAIcon = ({ icon, component: Component='span', extraClassname='', modifiers=[], ...props }) => {
  let className = classNames(
    'fa',
    'fas',
    'fa-icon',
    `fa-${icon}`,
    ...modifiers.map(mod => `fa-icon--${mod}`),
  );

  if (extraClassname) {
    className += ` ${extraClassname}`;
  }

  return (<Component className={className} {...props} />);
};

FAIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  modifiers: PropTypes.arrayOf(PropTypes.oneOf([
    'small',
    'normal',
    'inline',
  ])),
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
  extraClassname: PropTypes.string,
};


export default FAIcon;
