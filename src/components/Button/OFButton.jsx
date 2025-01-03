import {Button as UtrechtButton} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';

// Temporary until the aria-disabled is set on the Utrecht button
const OFButton = ({disabled, children, ...extraProps}) => {
  const {onClick: onClickHandler, ...otherProps} = extraProps;

  if (disabled) otherProps.className = 'utrecht-button--disabled';

  const onClick = event => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (onClickHandler) onClickHandler(event);
  };

  return (
    <UtrechtButton aria-disabled={disabled} onClick={onClick} {...otherProps}>
      {children}
    </UtrechtButton>
  );
};

OFButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default OFButton;
