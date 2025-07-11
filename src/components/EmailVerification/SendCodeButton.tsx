import {useFormikContext} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from 'Context';
import {post} from 'api';
import {OFButton} from 'components/Button';
import Loader from 'components/Loader';

const createVerification = async (
  baseUrl: string,
  submissionUrl: string,
  componentKey: string,
  emailAddress: string
) => {
  await post(`${baseUrl}submissions/email-verifications`, {
    submission: submissionUrl,
    componentKey,
    email: emailAddress,
  });
};

interface SendCodeButtonProps {
  submissionUrl: string;
  componentKey: string;
  emailAddress: string;
  onError: CallableFunction;
}

const SendCodeButton: React.FC<SendCodeButtonProps> = ({
  submissionUrl,
  componentKey,
  emailAddress,
  onError,
}) => {
  const {baseUrl} = useContext(ConfigContext);
  const [isSending, setIsSending] = useState(false);
  const {setFieldValue} = useFormikContext();
  return (
    <OFButton
      type="button"
      appearance="primary-action-button"
      variant="default"
      onClick={async () => {
        setIsSending(true);
        try {
          await createVerification(baseUrl, submissionUrl, componentKey, emailAddress);
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

export default SendCodeButton;
