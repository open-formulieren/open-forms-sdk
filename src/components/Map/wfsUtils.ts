import type {LatLngBounds} from 'leaflet';

export const getWFSVersion = async (getCapabilitiesUrl: string): Promise<string> => {
  const cacheKey = `wfs-version:${getCapabilitiesUrl}`;
  const missingVersionKey = 'version-missing-in-xml';
  const cacheResult = sessionStorage.getItem(cacheKey);

  if (cacheResult) {
    return cacheResult !== missingVersionKey ? cacheResult : Promise.reject();
  }

  const response = await fetch(getCapabilitiesUrl);
  const text = await response.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');

  const root = xml.documentElement;
  const version = root.getAttribute('version');
  if (!version) {
    sessionStorage.setItem(cacheKey, missingVersionKey);
    return Promise.reject();
  }

  sessionStorage.setItem(cacheKey, version);
  return version;
};

export const getWFSBbox = (bounds: LatLngBounds, crs: string, wfsVersion: string) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  // WFS version 1.0 expects lon/lat. WFS version 1.1 and 2.0 expect lat/lon
  const coords = wfsVersion.startsWith('1.0')
    ? [sw.lng, sw.lat, ne.lng, ne.lat]
    : [sw.lat, sw.lng, ne.lat, ne.lng];

  return `${coords.join(',')},${crs}`;
};
