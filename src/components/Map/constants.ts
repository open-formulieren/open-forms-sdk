// AVOID importing leaflet (or related libraries here) to ensure we don't break the
// bundle chunks.
import type {MapComponentSchema} from '@open-formulieren/types';

// Roughly the center of the Netherlands
export const DEFAULT_LAT_LNG: [number, number] = [52.1326332, 5.291266];
export const DEFAULT_ZOOM = 13;
export const DEFAULT_INTERACTIONS: MapComponentSchema['interactions'] = {
  marker: true,
  polygon: false,
  polyline: false,
};
