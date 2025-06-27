import type {PartnerDetails} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import Modal from 'components/modals/Modal';

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
  return (
    <Modal
      // @ts-expect-error The Modal has an empty string as a default value for the title
      title={
        <FormattedMessage description="Add partner modal title" defaultMessage="Add partner" />
      }
      isOpen={isOpen}
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
