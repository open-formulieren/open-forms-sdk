import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Modal from 'components/modals/Modal';

import AddPartnerForm from './AddPartnerForm';

const AddPartnerModal = ({partner, isOpen, closeModal, componentKey = [], onSave}) => {
  return (
    <Modal
      title={
        <FormattedMessage description="Add partner modal title" defaultMessage="Add partner" />
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <AddPartnerForm
        partner={partner}
        componentKey={componentKey}
        onSave={onSave}
        closeModal={closeModal}
      />
    </Modal>
  );
};

AddPartnerModal.propTypes = {
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
  componentKey: PropTypes.string.isRequired,
};

export default AddPartnerModal;
