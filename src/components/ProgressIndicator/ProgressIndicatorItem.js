import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Link from 'components/Link';
import {getBEMClassName} from 'utils';

import CompletionMark from './CompletionMark';

const getLinkModifiers = (isActive, isApplicable, isCompleted) => {
  return [
    'inherit',
    'hover',
    isActive ? 'active' : undefined,
    (isApplicable && !isCompleted) || !isApplicable ? 'muted' : undefined,
  ].filter(mod => mod !== undefined);
};

const ProgressIndicatorItem = ({label, to, isActive, isCompleted, canNavigateTo, isApplicable}) => {
  return (
    <div className={getBEMClassName('progress-indicator-item')}>
      <div className={getBEMClassName('progress-indicator-item__marker')}>
        <CompletionMark completed={isCompleted} />
      </div>
      <div className={getBEMClassName('progress-indicator-item__label')}>
        <Link
          to={to}
          placeholder={!canNavigateTo}
          modifiers={getLinkModifiers(isActive, isApplicable, isCompleted)}
          aria-label={label}
        >
          <FormattedMessage
            description="Step label in progress indicator"
            defaultMessage={`
            {isApplicable, select,
              false {{label} (n/a)}
              other {{label}}
            }`}
            values={{
              label: label,
              isApplicable: isApplicable,
            }}
          />
        </Link>
      </div>
    </div>
  );
};

ProgressIndicatorItem.propTypes = {
  label: PropTypes.node.isRequired,
  to: PropTypes.string,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  canNavigateTo: PropTypes.bool,
  isApplicable: PropTypes.bool,
};

export default ProgressIndicatorItem;
