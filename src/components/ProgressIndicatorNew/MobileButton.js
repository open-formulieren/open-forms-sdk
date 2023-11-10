import PropTypes from 'prop-types';

import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';

const MobileButton = ({
  ariaMobileIconLabel,
  accessibleToggleStepsLabel,
  formTitle,
  expanded,
  onExpandClick,
}) => {
  return (
    <button
      className={getBEMClassName('progress-indicator__mobile-header')}
      aria-pressed={expanded ? 'true' : 'false'}
      onClick={onExpandClick}
    >
      <FAIcon
        icon={expanded ? 'chevron-up' : 'chevron-down'}
        modifiers={['normal']}
        aria-label={ariaMobileIconLabel}
      />
      <span
        className={getBEMClassName('progress-indicator__form-title')}
        aria-label={accessibleToggleStepsLabel}
      >
        {formTitle}
      </span>
    </button>
  );
};

MobileButton.propTypes = {
  ariaMobileIconLabel: PropTypes.string,
  accessibleToggleStepsLabel: PropTypes.string,
  formTitle: PropTypes.string,
  expanded: PropTypes.bool,
  onExpandClick: PropTypes.func,
};

export default MobileButton;
