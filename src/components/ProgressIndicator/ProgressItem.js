import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

import CompletionMark from './CompletionMark';

const ProgressItem = ({completed, children, modifiers = []}) => {
  return (
    <div className={getBEMClassName('progress-indicator-item', modifiers)}>
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
  modifiers: PropTypes.array,
};

export default ProgressItem;
