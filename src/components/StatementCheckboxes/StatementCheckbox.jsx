import {Checkbox} from '@open-formulieren/formio-renderer';
import PropTypes from 'prop-types';
import {defineMessages, useIntl} from 'react-intl';

import Body from 'components/Body';
import ErrorMessage from 'components/Errors/ErrorMessage';

import './StatementCheckbox.scss';

// FIXME: when the checkboxes are made generic, the warnings should be provided by the
// backend.
const WARNINGS = defineMessages({
  privacyPolicyAccepted: {
    description: 'Warning privacy policy not checked when submitting',
    defaultMessage: 'Please accept the privacy policy before submitting',
  },
  statementOfTruthAccepted: {
    description: 'Warning statement of truth not checked when submitting',
    defaultMessage: 'You must declare the form to be filled out truthfully before submitting',
  },
});

const StatementCheckbox = ({configuration, showWarning = false}) => {
  const intl = useIntl();
  if (!configuration.validate.required) return null;
  // TODO: When we rework this component, change the class names
  return (
    <div className="openforms-privacy-checkbox">
      <Checkbox
        name={configuration.key}
        label={
          <Body
            component="div"
            modifiers={['wysiwyg', 'inline']}
            dangerouslySetInnerHTML={{__html: configuration.label}}
          />
        }
        isRequired
      />
      {showWarning && (
        <ErrorMessage level="warning">
          {intl.formatMessage(WARNINGS[configuration.key])}
        </ErrorMessage>
      )}
    </div>
  );
};

StatementCheckbox.propTypes = {
  configuration: PropTypes.shape({
    type: PropTypes.oneOf(['checkbox']).isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    validate: PropTypes.shape({
      required: PropTypes.bool,
    }),
  }).isRequired,
  /**
   * Whether to display the warning or not.
   */
  showWarning: PropTypes.bool,
};

export default StatementCheckbox;
