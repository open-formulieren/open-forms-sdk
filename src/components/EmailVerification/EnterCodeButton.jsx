import {useFormikContext} from 'formik';
import {FormattedMessage} from 'react-intl';

import {OFButton} from 'components/Button';
import Loader from 'components/Loader';

const EnterCodeButton = () => {
  const {isSubmitting} = useFormikContext();
  return (
    <OFButton type="submit" appearance="primary-action-button" disabled={isSubmitting}>
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
