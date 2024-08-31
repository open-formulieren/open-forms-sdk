import {useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {post} from 'api';
import {OFButton} from 'components/Button';
import Loader from 'components/Loader';
import {ValidationError} from 'errors';

const createVerification = async (baseUrl, {submissionUrl, componentKey, emailAddress}) => {
  await post(`${baseUrl}submissions/email-verifications`, {
    submission: submissionUrl,
    componentKey,
    email: emailAddress,
  });
};

const SendCodeButton = ({submissionUrl, componentKey, emailAddress}) => {
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
          if (e instanceof ValidationError) {
            // TODO: set in formik state
            console.error(e.invalidParams);
          } else {
            // TODO: catch and display error instead, now it's (silently) suppressed
            throw e;
          }
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
};

export default SendCodeButton;
