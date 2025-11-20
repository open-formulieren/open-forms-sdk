import {LoadingIndicator, PrimaryActionButton} from '@open-formulieren/formio-renderer';
import {useFormikContext} from 'formik';
import {useContext, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ConfigContext} from '@/Context';
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
    <PrimaryActionButton
      type="button"
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
        <LoadingIndicator position="center" size="small" color="muted" />
      ) : (
        <FormattedMessage
          description="Email verification: send code button text"
          defaultMessage="Send code"
        />
      )}
    </PrimaryActionButton>
  );
};

export default SendCodeButton;
