import {Modal} from '@open-formulieren/formio-renderer';
import {FormattedMessage} from 'react-intl';

import AddChildForm from './AddChildForm';
import type {ChildExtendedDetails} from './types';

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
  // ensure that the child values are passed to the underlying Formik only when the modal
  // is actually open
  if (!isOpen) return null;
  return (
    <Modal
      title={
        childValues ? (
          <FormattedMessage description="Edit child modal title" defaultMessage="Edit child" />
        ) : (
          <FormattedMessage description="Add child modal title" defaultMessage="Add child" />
        )
      }
      isOpen
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
