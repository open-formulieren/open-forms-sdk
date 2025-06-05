export interface Partner {
  bsn: string;
  affixes: string;
  initials: string;
  lastName: string;
  first_names: string;
  dateOfBirth: string;
  // this is added only for the SDK and helps us to distinguish a partner who is added
  // manually by the user (when no data was retreived from the relevant service)
  __addedManually?: boolean;
}

export interface PartnersFormProps {
  setFormioValues: (values: Partner[]) => void;
}

export interface PartnerFieldsProps {
  name: keyof Partner;
  label: React.ReactNode;
}
