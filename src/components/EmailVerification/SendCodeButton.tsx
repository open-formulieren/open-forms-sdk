import {useFormikContext} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from '@/Context';
import {post} from '@/api';
import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';

interface AdditionalVerificationProps {
  submissionUrl: string;
  componentKey: string;
  emailAddress: string;
}

const createVerification = async (
  baseUrl: string,
  {submissionUrl, componentKey, emailAddress}: AdditionalVerificationProps
): Promise<void> => {
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
  onError: (error: Error) => void;
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
      variant="primary"
      onClick={async () => {
        setIsSending(true);
        try {
          await createVerification(baseUrl, {submissionUrl, componentKey, emailAddress});
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
