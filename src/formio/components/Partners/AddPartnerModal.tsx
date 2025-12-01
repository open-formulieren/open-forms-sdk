import {Modal} from '@open-formulieren/formio-renderer';
import type {PartnerDetails} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import AddPartnerForm from './AddPartnerForm';

export interface AddPartnerModalProps {
  partner: PartnerDetails | null;
  isOpen: boolean;
  closeModal: () => void;
  onSave: (newPartner: PartnerDetails) => void;
}

export const AddPartnerModal: React.FC<AddPartnerModalProps> = ({
  partner,
  isOpen,
  closeModal,
  onSave,
}) => {
  // ensure that the child values are passed to the underlying Formik only when the modal
  // is actually open
  if (!isOpen) return null;
  return (
    <Modal
      title={
        <FormattedMessage description="Add partner modal title" defaultMessage="Add partner" />
      }
      isOpen
      closeModal={closeModal}
    >
      <AddPartnerForm
        partner={partner}
        onSave={(partner: PartnerDetails) => {
          onSave(partner);
          closeModal();
        }}
      />
    </Modal>
  );
};

export default AddPartnerModal;
