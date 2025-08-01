import {FormattedMessage} from 'react-intl';

import Modal from 'components/modals/Modal';

import AddChildForm from './AddChildForm';
import {ChildExtendedDetails} from './types';

export interface AddChildrenModalProps {
  childValues: ChildExtendedDetails | null;
  isOpen: boolean;
  closeModal: () => void;
  onSave: (child: ChildExtendedDetails) => void;
}

const AddChildModal: React.FC<AddChildrenModalProps> = ({
  childValues,
  isOpen,
  closeModal,
  onSave,
}) => {
  return (
    <Modal
      title={
        childValues ? (
          <FormattedMessage description="Edit child modal title" defaultMessage="Edit child" />
        ) : (
          <FormattedMessage description="Add child modal title" defaultMessage="Add child" />
        )
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <AddChildForm
        childValues={childValues}
        onSave={(child: ChildExtendedDetails) => {
          onSave(child);
          closeModal();
        }}
      />
    </Modal>
  );
};

export default AddChildModal;
