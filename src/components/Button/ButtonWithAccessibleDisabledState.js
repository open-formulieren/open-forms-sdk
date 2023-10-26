import {Button as UtrechtButton} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React from 'react';

// Temporary until the aria-disabled is set on the Utrecht button
const ButtonWithAccessibleDisabledState = ({disabled, children, ...extraProps}) => {
  return (
    <UtrechtButton disabled={disabled} aria-disabled={disabled} {...extraProps}>
      {children}
    </UtrechtButton>
  );
};

ButtonWithAccessibleDisabledState.propTypes = {
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default ButtonWithAccessibleDisabledState;
