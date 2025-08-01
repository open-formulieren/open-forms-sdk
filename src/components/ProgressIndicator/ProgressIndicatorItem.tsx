import {FormattedMessage} from 'react-intl';
import {useLocation} from 'react-router';

import type {Variant as LinkVariant} from '@/components/Anchor/Anchor';
import Link from '@/components/Link';

import CompletionMark from './CompletionMark';

const getLinkModifiers = (isActive: boolean): LinkVariant[] => {
  const modifiers: LinkVariant[] = ['inherit', 'hover'];
  if (isActive) {
    modifiers.push('current');
  }
  return modifiers;
};

export interface ProgressIndicatorItemProps {
  label: string;
  to: string;
  isActive: boolean;
  isCompleted: boolean;
  canNavigateTo: boolean;
  isApplicable: boolean;
}

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
const ProgressIndicatorItem: React.FC<ProgressIndicatorItemProps> = ({
  label,
  to,
  isActive,
  isCompleted,
  canNavigateTo,
  isApplicable,
}) => {
  const location = useLocation();
  return (
    <div className="openforms-progress-indicator-item">
      <div className="openforms-progress-indicator-item__marker">
        <CompletionMark completed={isCompleted} />
      </div>
      <div className="openforms-progress-indicator-item__label">
        <Link
          to={to}
          state={location.state}
          placeholder={!canNavigateTo}
          modifiers={canNavigateTo ? getLinkModifiers(isActive) : []}
          aria-label={label}
          aria-current={isActive ? 'step' : undefined}
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

export default ProgressIndicatorItem;
