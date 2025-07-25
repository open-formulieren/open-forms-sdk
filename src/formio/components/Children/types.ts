import type {ChildDetails} from '@open-formulieren/types';

export interface ChildExtendedDetails extends ChildDetails {
  // distinguish a child added manually by the user (when no data was retreived from the
  // relevant service) - this is used only for the SDK to serve extra functionality for
  // the children
  __addedManually?: boolean;
  // distinguish a child selected by the user (checkbox)
  selected?: boolean;
}
