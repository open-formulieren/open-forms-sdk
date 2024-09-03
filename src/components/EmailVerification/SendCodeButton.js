import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {post} from 'api';
import {OFButton} from 'components/Button';
import Loader from 'components/Loader';

const createVerification = async (baseUrl, {submissionUrl, componentKey, emailAddress}) => {
  await post(`${baseUrl}submissions/email-verifications`, {
    submission: submissionUrl,
    componentKey,
    email: emailAddress,
  });
};

const SendCodeButton = ({submissionUrl, componentKey, emailAddress, onError}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [isSending, setIsSending] = useState(false);
  const {setFieldValue} = useFormikContext();
  return (
    <OFButton
      type="button"
      appearance="primary-action-button"
      onClick={async () => {
        setIsSending(true);
        try {
          await createVerification(baseUrl, {
            submissionUrl,
            componentKey,
            emailAddress,
          });
        } catch (e) {
          onError(e);
        } finally {
          setIsSending(false);
        }

        setFieldValue('mode', 'enterCode');
      }}
      disabled={!emailAddress || isSending}
    >
      {isSending ? (
        <Loader modifiers={['centered', 'only-child', 'small', 'gray']} />
      ) : (
        <FormattedMessage
          description="Email verification: send code button text"
          defaultMessage="Send code"
        />
      )}
    </OFButton>
  );
};

SendCodeButton.propTypes = {
  submissionUrl: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
};

export default SendCodeButton;
