import React from 'react';
import PropTypes from 'prop-types';

import { applyPrefix } from './formio/utils';


const Button = ({ type="", component="button", variant="", children, ...extra }) => {
    const Component = `${component}`;

    const classNameBits = ['button'];
    if (variant) {
      classNameBits.push(`button--${variant}`);
    }
    const className = classNameBits.map(bit => applyPrefix(bit)).join(' ');

    const props = {
      className,
      ...extra,
    };
    if (type) {
      props.type = type;
    }
    return (
      <Component {...props}>
        { children ? <span className={applyPrefix('button__label')}>{children}</span> : null }
      </Component>
    );
};

Button.propTypes = {
    component: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};


export default Button;
