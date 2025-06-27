import type {PartnerDetails} from '@open-formulieren/types';

export interface PartnerManuallyAdded extends PartnerDetails {
  // this is added only for the SDK and helps us to distinguish a partner who is added
  // manually by the user (when no data was retreived from the relevant service)
  __addedManually?: true;
}
