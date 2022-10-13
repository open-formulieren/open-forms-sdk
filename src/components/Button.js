import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';
import { Button as UtrechtButton, LinkButton as UtrechtLinkButton, ButtonLink as UtrechtButtonLink } from '@utrecht/component-library-react';

export const VARIANTS = [
  '',
  'primary',
  'secondary',
  'anchor',
  'danger',
  'image',
];

const Button = ({ type='', component: Component=UtrechtButton, variant='', onDisabledClick, children, ...extra }) => {
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

    switch (variant) {
      case 'primary': {
        props.appearance = 'primary-action-button';
        break;
      }
      case 'secondary': {
        props.appearance = 'secondary-action-button'
        break;
      }
      case 'danger': {
        props.appearance = 'primary-action-button';
        props.hint = 'danger';
        break;
      }
      case 'anchor': {
        switch (Component) {
          case 'a': {
            // ButtonLink uses <a> element
            Component = UtrechtButtonLink;
            break;
          }
          case 'button': {
            // LinkButton link uses <button> element
            Component = UtrechtLinkButton;
            break;
          }
          default: {
            // Render `UtrechtButton` or custom component
            break;
          }
        }
        break;
      }
      default: {
        // Unknown or no specified variant requires no additional properties
        // for design system components.
        break;
      }
    }

    children = children ? <span className={getBEMClassName('button__label')}>{children}</span> : null;

    return (
      <Component {...props}>
        {children}
      </Component>
    );
};

Button.propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.elementType,
    ]),
    variant: PropTypes.oneOf(VARIANTS),
    onDisabledClick: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default Button;
