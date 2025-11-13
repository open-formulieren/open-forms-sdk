import {useFormikContext} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from '@/Context';
import {OFButton} from '@/components/Button';
import Loader from '@/components/Loader';
import {requestEmailVerificationCode} from '@/data/submissions';
import type {Submission} from '@/data/submissions';

interface SendCodeButtonProps {
  submission: Submission;
  componentKey: string;
  emailAddress: string;
  onError: (error: Error) => void;
}

const SendCodeButton: React.FC<SendCodeButtonProps> = ({
  submission,
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
          await requestEmailVerificationCode(baseUrl, submission, componentKey, emailAddress, {
            rethrowError: true,
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

export default SendCodeButton;
