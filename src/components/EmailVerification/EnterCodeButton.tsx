import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';

const EnterCodeButton: React.FC = () => {
  const {isSubmitting} = useFormikContext();
  return (
    <OFButton type="submit" variant="primary" disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <FormattedMessage
          description="Email verification: verify code button text"
          defaultMessage="Verify"
        />
      )}
    </OFButton>
  );
};

export default EnterCodeButton;
