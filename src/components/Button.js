import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';


const Button = ({ type="", component="button", variant="", children, ...extra }) => {
    const Component = `${component}`;
    const className = getBEMClassName('button', [variant]);

    const props = {
      className,
      ...extra,
    };
    if (type) {
      props.type = type;
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
