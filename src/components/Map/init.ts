// sort-imports-ignore
// a hack - this library has side effects because it patches L from leaflet.
import L from 'leaflet';
import 'proj4leaflet';
import {GestureHandling} from 'leaflet-gesture-handling';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let initialized: boolean = false;

/**
 * fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
 */
const fixIconUrls = (): void => {
  // @ts-expect-error untyped private property
  delete L.Icon.Default.prototype._getIconUrl;
  // the call to `require` ensures that the static assets are bundled along (or, for small
  // images, inlined as base64)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
  });
};

const initialize = (): void => {
  if (initialized) return;
  fixIconUrls();
  L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  initialized = true;
};

export {CRS_RD, TILE_LAYER_RD} from '@open-formulieren/leaflet-tools';
export {initialize};
