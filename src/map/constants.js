// sort-imports-ignore
// a hack - this library has side effects because it patches L from leaflet.
import 'proj4leaflet';
import {CRS_RD, TILES_ATTRIBUTION, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';

// Roughly the center of the Netherlands
const DEFAULT_LAT_LNG = [52.1326332, 5.291266];
const DEFAULT_ZOOM = 13;

export {CRS_RD, DEFAULT_LAT_LNG, DEFAULT_ZOOM, TILES_ATTRIBUTION, TILE_LAYER_RD};
