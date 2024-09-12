import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

/**
 * A single summary progress indicator.
 *
 * It shows the short progress summary, indicating the current step number and total amount of steps.
 */
export const SummaryProgress = ({current, total}) => {
  return (
    <div className="openforms-summary-progress">
      <FormattedMessage
        description="Summary progress label"
        defaultMessage="Step {current} of {total}"
        values={{
          current: current,
          total: total,
        }}
      />
    </div>
  );
};

SummaryProgress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default SummaryProgress;
