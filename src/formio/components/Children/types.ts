import type {ChildDetails} from '@open-formulieren/types';

export interface ChildExtendedDetails extends ChildDetails {
  // this is used only for the SDK to serve extra functionality for the children

  // distinguish a child added manually by the user (when no data was retreived from the
  // relevant service)
  __addedManually?: true;
  // distinguish a child selected by the user (checkbox)
  __selected?: false;
}
