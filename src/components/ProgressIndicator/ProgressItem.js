import React from 'react';
import PropTypes from 'prop-types';

import {getBEMClassName} from 'utils';

import CompletionMark from './CompletionMark';

const ProgressItem = ({completed, children}) => {
  return (
    <div className={getBEMClassName('progress-indicator-item')}>
      <div className={getBEMClassName('progress-indicator-item__marker')}>
        <CompletionMark completed={completed} />
      </div>

      <div className={getBEMClassName('progress-indicator-item__label')}>{children}</div>
    </div>
  );
};

ProgressItem.propTypes = {
  completed: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default ProgressItem;
