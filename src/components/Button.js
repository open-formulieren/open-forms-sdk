import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const Button = ({ type="", component="button", variant="", children, ...extra }) => {
    const Component = `${component}`;
    const className = getBEMClassName('button', [variant]);

    // https://www.a11y-101.com/development/aria-disabled
    const {disabled, ...remainingProps} = extra;

    const props = {
      className,
      ...remainingProps,
    };
    if (type) {
      props.type = type;
    }

    if (disabled) {
      props['aria-disabled'] = 'true';
    }

    return (
      <Component {...props}>
        { children ? <span className={getBEMClassName('button__label')}>{children}</span> : null }
      </Component>
    );
};

Button.propTypes = {
    component: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};


export default Button;
