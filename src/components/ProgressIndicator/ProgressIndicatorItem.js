import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Link from 'components/Link';
import {getBEMClassName} from 'utils';

import CompletionMark from './CompletionMark';

const ProgressIndicatorItem = ({
  text,
  href,
  isActive,
  isCompleted,
  canNavigateTo,
  isApplicable,
  fixedText = null,
}) => {
  const getLinkModifiers = (isActive, isApplicable) => {
    return [
      'inherit',
      'hover',
      isActive ? 'active' : undefined,
      isApplicable ? undefined : 'muted',
    ].filter(mod => mod !== undefined);
  };

  return (
    <div className={getBEMClassName('progress-indicator-item')}>
      <div className={getBEMClassName('progress-indicator-item__marker')}>
        <CompletionMark completed={isCompleted} />
      </div>
      <div className={getBEMClassName('progress-indicator-item__label')}>
        {isApplicable && canNavigateTo ? (
          <Link
            to={href}
            placeholder={!canNavigateTo}
            modifiers={getLinkModifiers(isActive, isApplicable)}
            aria-label={text}
          >
            <FormattedMessage
              description="Step label in progress indicator"
              defaultMessage={`
            {isApplicable, select,
              false {{label} (n/a)}
              other {{label}}
            }`}
              values={{
                label: fixedText || text,
                isApplicable: isApplicable,
              }}
            />
          </Link>
        ) : (
          <Body component="span" modifiers={isCompleted ? ['big'] : ['big', 'muted']}>
            {fixedText || text}
          </Body>
        )}
      </div>
    </div>
  );
};

ProgressIndicatorItem.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  canNavigateTo: PropTypes.bool,
  isApplicable: PropTypes.bool,
  fixedText: PropTypes.element,
};

export default ProgressIndicatorItem;
