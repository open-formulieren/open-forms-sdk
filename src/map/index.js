import L from 'leaflet';
import {GestureHandling} from 'leaflet-gesture-handling';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

/**
 * fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
 * @return {Void}
 */
const fixIconUrls = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  // the call to `require` ensures that the static assets are bundled along (or, for small
  // images, inlined as base64)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
  });
};

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

export {fixIconUrls};
