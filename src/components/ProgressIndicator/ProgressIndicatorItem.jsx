import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Link from 'components/Link';
import {getBEMClassName} from 'utils';

import CompletionMark from './CompletionMark';

const getLinkModifiers = isActive => {
  const modifiers = ['inherit', 'hover'];
  if (isActive) {
    modifiers.push('current');
  }
  return modifiers;
};

/**
 * A single progress indicator item.
 *
 * Displays a link (which *may* be a placeholder depending on the `canNavigateTo` prop)
 * to the specified route with the provided label.
 *
 * If the item is not applicable, the label is suffixed to mark it as such. Depending on
 * server-side configuration, the item may be hidden alltogether (rather than showing it
 * with the suffix).
 *
 * Once a step is completed, it is displayed with a completion checkmark in front of it.
 */
export const ProgressIndicatorItem = ({
  label,
  to,
  isActive,
  isCompleted,
  canNavigateTo,
  isApplicable,
}) => {
  return (
    <div className={getBEMClassName('progress-indicator-item')}>
      <div className={getBEMClassName('progress-indicator-item__marker')}>
        <CompletionMark completed={isCompleted} />
      </div>
      <div className={getBEMClassName('progress-indicator-item__label')}>
        <Link
          to={to}
          placeholder={!canNavigateTo}
          modifiers={canNavigateTo ? getLinkModifiers(isActive) : []}
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
