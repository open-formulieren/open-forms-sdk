import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import Modal from 'components/modals/Modal';

import AddPartnerForm from './AddPartnerForm';

const AddPartnerModal = ({partner, isOpen, closeModal, componentKey, onSave}) => {
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
  partner: PropTypes.shape({
    bsn: PropTypes.string,
    initials: PropTypes.string,
    affixes: PropTypes.string,
    lastName: PropTypes.string,
    dateOfBirth: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  componentKey: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};

export default AddPartnerModal;
