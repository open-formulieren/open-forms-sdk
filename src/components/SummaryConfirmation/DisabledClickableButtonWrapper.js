import PropTypes from 'prop-types';
import React from 'react';

const DisabledClickableButtonWrapper = ({disabled, onDisabledClick, children}) => {
  if (!disabled) return <>{children}</>;

  return (
    <div onClick={onDisabledClick} className="openforms-disabled-clickable-button">
      <div className="openforms-disabled-clickable-button__clickable-wrap">{children}</div>
    </div>
  );
};

DisabledClickableButtonWrapper.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onDisabledClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default DisabledClickableButtonWrapper;
