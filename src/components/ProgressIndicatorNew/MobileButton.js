import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import FAIcon from 'components/FAIcon';
import {getBEMClassName} from 'utils';

const MobileButton = ({
  ariaIconLabel,
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
        aria-label={ariaIconLabel}
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
  ariaIconLabel: PropTypes.string.isRequired,
  accessibleToggleStepsLabel: PropTypes.oneOfType([PropTypes.string, FormattedMessage]),
  formTitle: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onExpandClick: PropTypes.func.isRequired,
};

export default MobileButton;
