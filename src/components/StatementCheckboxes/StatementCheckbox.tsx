import {Checkbox} from '@open-formulieren/formio-renderer';
import {CheckboxComponentSchema} from '@open-formulieren/types';
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

export interface StatementCheckboxProps {
  // the backend doesn't add the `id` property - that's okay, we can inject one if we
  // need to
  configuration: Omit<CheckboxComponentSchema, 'id' | 'defaultValue'> & {
    key: 'privacyPolicyAccepted' | 'statementOfTruthAccepted';
  };
  showWarning?: boolean;
}

const StatementCheckbox: React.FC<StatementCheckboxProps> = ({
  configuration,
  showWarning = false,
}) => {
  const intl = useIntl();
  if (!configuration?.validate?.required) return null;

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

export default StatementCheckbox;
