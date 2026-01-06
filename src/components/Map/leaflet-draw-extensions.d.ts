import 'leaflet';

import type {Interactions} from './types';

// Include custom Leaflet method to typescript definitions
declare module 'leaflet' {
  namespace Control {
    interface Draw {
      enableDrawingMode?(shape: keyof Interactions): void;
      disableDrawingMode?(shape: keyof Interactions): void;
    }
  }
}
