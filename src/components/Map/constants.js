// AVOID importing leaflet (or related libraries here) to ensure we don't break the
// bundle chunks.

// Roughly the center of the Netherlands
export const DEFAULT_LAT_LNG = [52.1326332, 5.291266];
export const DEFAULT_ZOOM = 13;
export const DEFAULT_INTERACTIONS = {
  marker: true,
  polygon: false,
  polyline: false,
};
