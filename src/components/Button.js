import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

export const VARIANTS = [
  '',
  'primary',
  'secondary',
  'anchor',
  'danger',
  'image',
];


const Button = ({ type='', component: Component='button', variant='', onDisabledClick, children, ...extra }) => {
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
      // force the onClick handler to do nothing so we can't submit
      props.onClick = (event) => {
        if (onDisabledClick) onDisabledClick();
        event.preventDefault();
      };
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
    variant: PropTypes.oneOf(VARIANTS),
    onDisabledClick: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default Button;
