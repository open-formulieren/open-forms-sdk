import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Layout component to render the form container.
 * @return {JSX}
 */
const FormDisplay = ({
  router,
  progressIndicator = null,
  showProgressIndicator = true,
  isPaymentOverview = false,
}) => {
  const renderProgressIndicator = progressIndicator && showProgressIndicator && !isPaymentOverview;
  return (
    <div
      className={classNames('openforms-form', {
        'openforms-form--body-only': !renderProgressIndicator,
      })}
    >
      <div className="openforms-form__body">{router}</div>
      {renderProgressIndicator && (
        <div className="openforms-form__progress-indicator">{progressIndicator}</div>
      )}
    </div>
  );
};

FormDisplay.propTypes = {
  router: PropTypes.node.isRequired,
  progressIndicator: PropTypes.node,
  showProgressIndicator: PropTypes.bool,
  isPaymentOverview: PropTypes.bool,
};

export default FormDisplay;
