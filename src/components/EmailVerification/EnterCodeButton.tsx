import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

const EnterCodeButton: React.FC = () => {
  const {isSubmitting} = useFormikContext();
  return (
    <PrimaryActionButton type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <LoadingIndicator position="center" size="small" color="muted" />
      ) : (
        <FormattedMessage
          description="Email verification: verify code button text"
          defaultMessage="Verify"
        />
      )}
    </PrimaryActionButton>
  );
};

export default EnterCodeButton;
