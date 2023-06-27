import PropTypes from 'prop-types';
import React from 'react';

import {LayoutColumn} from 'components/Layout';

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
    <>
      <LayoutColumn modifiers={['mobile-order-2', 'mobile-padding-top']}>{router}</LayoutColumn>
      {renderProgressIndicator ? (
        <LayoutColumn modifiers={['secondary', 'mobile-order-1', 'mobile-sticky']}>
          {progressIndicator}
        </LayoutColumn>
      ) : null}
    </>
  );
};

FormDisplay.propTypes = {
  router: PropTypes.node.isRequired,
  progressIndicator: PropTypes.node,
  showProgressIndicator: PropTypes.bool,
  isPaymentOverview: PropTypes.bool,
};

export default FormDisplay;
