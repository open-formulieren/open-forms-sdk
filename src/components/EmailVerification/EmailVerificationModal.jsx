import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';

import Body from 'components/Body';
import Modal from 'components/modals/Modal';

import EmailVerificationForm from './EmailVerificationForm';

const EmailVerificationModal = ({
  isOpen,
  closeModal,
  submissionUrl,
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
          submissionUrl={submissionUrl}
          componentKey={componentKey}
          emailAddress={emailAddress}
          onVerified={() => setIsVerified(true)}
        />
      )}
      <div aria-live="polite">{isVerified && <VerificationSuccess />}</div>
    </Modal>
  );
};

EmailVerificationModal.propTypes = {
  /**
   * Modal open/closed state.
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to close the modal
   *
   * Invoked on ESC keypress or clicking the "X" to close the modal.
   */
  closeModal: PropTypes.func.isRequired,
  submissionUrl: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
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
