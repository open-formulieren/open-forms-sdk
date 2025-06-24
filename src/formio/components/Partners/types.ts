import {MessageDescriptor} from 'react-intl';

export interface Partner {
  bsn: string;
  affixes: string;
  initials: string;
  lastName: string;
  first_names: string;
  dateOfBirth: string;
}

export interface PartnerManuallyAdded extends Partner {
  // this is added only for the SDK and helps us to distinguish a partner who is added
  // manually by the user (when no data was retreived from the relevant service)
  __addedManually?: true;
}

export interface PartnersFormProps {
  setFormioValues: (values: Partner[]) => void;
}

export interface PartnerFieldsProps {
  name: keyof Partner;
  label: MessageDescriptor;
}

export interface PartnersFormikProps {
  initialValues: Partner[];
  onFormikChange: (values: Partner[]) => void;
  hasNoPartners: boolean;
  manuallyAddedPartner?: PartnerManuallyAdded;
  onAddPartner: () => void;
  onEditPartner: () => void;
}

export interface AddPartnerModalProps {
  partner: Partner | null;
  isOpen: boolean;
  closeModal: () => void;
  onSave: (newPartner: Partner) => void;
}

export interface AddPartnerFormProps {
  partner: Partner | null;
  onSave: (partner: Partner) => void;
  closeModal: () => void;
}
