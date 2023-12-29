// a hack - this library has side effects because it patches L from leaflet.
import {CRS_RD, TILES_ATTRIBUTION, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
import 'proj4leaflet';

// Roughly the center of the Netherlands
const DEFAULT_LAT_LNG = [52.1326332, 5.291266];
const DEFAULT_ZOOM = 13;

const MAP_DEFAULTS = {
  continuousWorld: true,
  crs: CRS_RD,
  attributionControl: true,
  center: DEFAULT_LAT_LNG,
  zoom: DEFAULT_ZOOM,
};

export {TILES_ATTRIBUTION, TILE_LAYER_RD, DEFAULT_LAT_LNG, DEFAULT_ZOOM, MAP_DEFAULTS};
