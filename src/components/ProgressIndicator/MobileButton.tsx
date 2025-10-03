import {forwardRef} from 'react';

import FAIcon from '@/components/FAIcon';

export interface MobileButtonProps {
  ariaMobileIconLabel: string;
  accessibleToggleStepsLabel: string;
  formTitle: string;
  expanded?: boolean;
  onExpandClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ariaMobileIconLabel, accessibleToggleStepsLabel, formTitle, expanded, onExpandClick}, ref) => {
    return (
      <button
        ref={ref}
        className="openforms-progress-indicator__mobile-header"
        aria-pressed={expanded ? 'true' : 'false'}
        onClick={onExpandClick}
      >
        <FAIcon
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          normal
          aria-label={ariaMobileIconLabel}
        />
        <span
          className="openforms-progress-indicator__form-title"
          aria-label={accessibleToggleStepsLabel}
        >
          {formTitle}
        </span>
      </button>
    );
  }
);

MobileButton.displayName = 'MobileButton';

export default MobileButton;
