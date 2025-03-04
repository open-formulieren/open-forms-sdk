import {RadioField} from '@open-formulieren/formio-renderer';
import {useIntl} from 'react-intl';

const ModeField = () => {
  const intl = useIntl();
  return (
    <RadioField
      name="mode"
      isRequired
      label={intl.formatMessage({
        description: 'Email verification mode selection label',
        defaultMessage: 'What would you like to do?',
      })}
      options={[
        {
          value: 'sendCode',
          label: intl.formatMessage({
            description: 'Email verification mode selection: send code label',
            defaultMessage: 'Receive a verification code',
          }),
        },
        {
          value: 'enterCode',
          label: intl.formatMessage({
            description: 'Email verification mode selection: enter code label',
            defaultMessage: 'Enter the verification code',
          }),
        },
      ]}
    />
  );
};

export default ModeField;
