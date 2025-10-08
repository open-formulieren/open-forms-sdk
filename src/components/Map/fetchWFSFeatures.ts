import type {FeatureCollection} from 'geojson';
import type {LatLngBounds, Map} from 'leaflet';

const getWFSVersion = async (getCapabilitiesUrl: string): Promise<string> => {
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

const getWFSBbox = (bounds: LatLngBounds, crs: string, wfsVersion: string) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  // WFS version 1.0 expects lon/lat. WFS version 1.1 and 2.0 expect lat/lon
  const coords = wfsVersion.startsWith('1.0')
    ? [sw.lng, sw.lat, ne.lng, ne.lat]
    : [sw.lat, sw.lng, ne.lat, ne.lng];

  return `${coords.join(',')},${crs}`;
};

export const fetchFeatureCollections = async (
  url: string,
  featureTypes: string[],
  map: Map
): Promise<FeatureCollection[]> => {
  const baseUrl = new URL(url).href.split('?')[0];

  const bounds = map.getBounds();
  const wfsVersion = await getWFSVersion(url);
  const isWfsVersion2 = wfsVersion.startsWith('2.');

  // Version 1.x and 2.0.0 of WFS use different formats for EPSG and bbox,
  // and a different query parameter for typeName.
  const crs = isWfsVersion2 ? 'urn:ogc:def:crs:EPSG::4326' : 'EPSG:4326';
  const typeNameParam = isWfsVersion2 ? 'typenames' : 'typename';
  const bbox = getWFSBbox(bounds, crs, wfsVersion);

  // PDOK doesn't support multiple feature types in one request, for the outputFormat
  // JSON. So we spread them out to multiple requests, that are then merged into one
  // layer.
  const requests = featureTypes.map(async typeName => {
    const requestUrl =
      `${baseUrl}?service=WFS&version=${wfsVersion}&request=GetFeature&${typeNameParam}=${typeName}` +
      `&outputFormat=application/json&srsName=${crs}&bbox=${bbox}`;
    const response = await fetch(requestUrl);
    return await response.json();
  });

  return Promise.all(requests);
};
