import type {ChildDetails} from '@open-formulieren/types/dist/components/children';
import type {UUID} from 'crypto';

export interface ChildExtendedDetails extends ChildDetails {
  // distinguish a child added manually by the user (when no data was retreived from the
  // relevant service) - these are used only for the SDK to serve extra functionality for
  // the children
  __addedManually?: boolean;
  __id: UUID;
}
