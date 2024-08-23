import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import Modal from 'components/modals/Modal';

import EmailVerificationForm from './EmailVerificationForm';

const EmailVerificationModal = ({
  isOpen,
  closeModal,
  submissionUrl,
  componentKey,
  emailAddress,
}) => (
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
    <EmailVerificationForm
      submissionUrl={submissionUrl}
      componentKey={componentKey}
      emailAddress={emailAddress}
    />
  </Modal>
);

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

export default EmailVerificationModal;
