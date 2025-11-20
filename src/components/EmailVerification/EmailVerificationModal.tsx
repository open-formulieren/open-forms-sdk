import {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import Body from '@/components/Body';
import type {ModalCloseHandler} from '@/components/modals/Modal';
import Modal from '@/components/modals/Modal';
import type {Submission} from '@/data/submissions';

import EmailVerificationForm from './EmailVerificationForm';

export interface EmailVerificationModalProps {
  /**
   * Modal open/closed state.
   */
  isOpen: boolean;
  /**
   * Callback function to close the modal
   *
   * Invoked on ESC keypress or clicking the "X" to close the modal.
   */
  closeModal: ModalCloseHandler;
  submission: Submission;
  componentKey: string;
  emailAddress: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  closeModal,
  submission,
  componentKey,
  emailAddress,
}) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // once the modal closes, reset the internal state
    if (!isOpen && isVerified) setIsVerified(false);
  }, [isOpen, isVerified, setIsVerified]);

  return (
    <Modal
      title={
        <FormattedMessage
          description="Email verification modal title"
          defaultMessage="Email address verification"
        />
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      {!isVerified && (
        <EmailVerificationForm
          submission={submission}
          componentKey={componentKey}
          emailAddress={emailAddress}
          onVerified={() => setIsVerified(true)}
        />
      )}
      <div aria-live="polite">{isVerified && <VerificationSuccess />}</div>
    </Modal>
  );
};

const VerificationSuccess = () => (
  <Body modifiers={['big']}>
    <FormattedMessage
      description="Text displayed after successful email verification"
      defaultMessage={`The email address has now been verified. You can close this
      window and continue with the rest of the form.`}
    />
  </Body>
);

export default EmailVerificationModal;
