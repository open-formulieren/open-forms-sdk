import {RD_CRS} from './rd';

const TILES = 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard';

const ATTRIBUTION = `
    Kaartgegevens &copy;
    <a href="https://www.kadaster.nl">Kadaster</a> |
    <a href="https://www.verbeterdekaart.nl">Verbeter de kaart</a>
`;

const TILE_LAYERS = {
  url: `${TILES}/EPSG:28992/{z}/{x}/{y}.png`,
  options: {
    minZoom: 1,
    maxZoom: 13,
    attribution: ATTRIBUTION,
  },
};

// Roughly the center of the Netherlands
const DEFAULT_LAT_LON = [52.1326332, 5.291266];
const DEFAULT_ZOOM = 13;

const MAP_DEFAULTS = {
  continuousWorld: true,
  crs: RD_CRS,
  attributionControl: true,
  center: DEFAULT_LAT_LON,
  zoom: DEFAULT_ZOOM,
};

export {TILES, ATTRIBUTION, TILE_LAYERS, DEFAULT_LAT_LON, DEFAULT_ZOOM, MAP_DEFAULTS};
