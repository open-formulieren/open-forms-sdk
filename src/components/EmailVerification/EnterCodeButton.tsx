import {PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import Loader from '@/components/Loader';

const EnterCodeButton: React.FC = () => {
  const {isSubmitting} = useFormikContext();
  return (
    <PrimaryActionButton type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
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
