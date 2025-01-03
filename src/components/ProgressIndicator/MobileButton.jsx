import PropTypes from 'prop-types';
import {forwardRef} from 'react';

import FAIcon from 'components/FAIcon';

const MobileButton = forwardRef(
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
          modifiers={['normal']}
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

MobileButton.propTypes = {
  ariaMobileIconLabel: PropTypes.string.isRequired,
  accessibleToggleStepsLabel: PropTypes.string.isRequired,
  formTitle: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onExpandClick: PropTypes.func.isRequired,
};

export default MobileButton;
