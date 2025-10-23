import type {FeatureCollection} from 'geojson';
import * as Leaflet from 'leaflet';

interface Tile {
  x: number;
  y: number;
}

/**
 * Get the version of a WFS overlay from session storage, or by inspecting the
 * xml capabilities.
 *
 * @param getCapabilitiesUrl
 */
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

/**
 * Get the bounding box (bbox) for the specified bounds, crs and WFS version.
 *
 * Bbox is used in the `getFeature` request, to limit the results to a group of
 * coordinates. The different WFS versions expect the bbox coordinates in different
 * orders.
 *
 * @param bounds The coordinates for which the bbox should be made.
 * @param crs The projection used to describe the coordinates.
 * @param wfsVersion Version of the WFS source.
 */
const getWFSBbox = (bounds: Leaflet.LatLngBounds, crs: string, wfsVersion: string) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  // WFS version 1.0 expects lon/lat. WFS version 1.1 and 2.0 expect lat/lon
  const coords = wfsVersion.startsWith('1.0')
    ? [sw.lng, sw.lat, ne.lng, ne.lat]
    : [sw.lat, sw.lng, ne.lat, ne.lng];

  return `${coords.join(',')},${crs}`;
};

/**
 * Fetch WFS data for specified feature types and map tiles.
 *
 * To boost performance, we re-use already fetched WFS data and use a tiles system to
 * fetch only the unknown WFS data. The tiles are transformed to coordinates, which are
 * used to fetch WFS data for specific bounding boxes.
 *
 * @param url The url of the WFS source.
 * @param featureTypes The feature/data types to fetch from the WFS source.
 * @param tiles Map tiles that will be used for the request bounding boxes.
 * @param map Map instance, used to calculate the tile sizes.
 */
const fetchFeatureCollections = async (
  url: string,
  featureTypes: string[],
  tiles: Tile[],
  map: Leaflet.Map
): Promise<FeatureCollection[]> => {
  const baseUrl = new URL(url).href.split('?')[0];

  const wfsVersion = await getWFSVersion(url);
  const isWfsVersion2 = wfsVersion.startsWith('2.');

  // Version 1.x and 2.0.0 of WFS use different formats for EPSG and bbox,
  // and a different query parameter for typeName.
  const crs = isWfsVersion2 ? 'urn:ogc:def:crs:EPSG::4326' : 'EPSG:4326';
  const typeNameParam = isWfsVersion2 ? 'typenames' : 'typename';

  const requests: Promise<FeatureCollection>[] = [];

  tiles.forEach(tile => {
    // Turn the tile into coordinates and create the bounding box.
    const bounds = tileToBounds(tile, map);
    const bbox = getWFSBbox(bounds, crs, wfsVersion);

    // PDOK doesn't support multiple feature types in one request, for the outputFormat
    // JSON. So we spread them out to multiple requests, that are then merged into one
    // layer.
    requests.push(
      ...featureTypes.map(async typeName => {
        const requestUrl =
          `${baseUrl}?service=WFS&version=${wfsVersion}&request=GetFeature&${typeNameParam}=${typeName}` +
          `&outputFormat=application/json&srsName=${crs}&bbox=${bbox}&count=500`;
        const response = await fetch(requestUrl);
        return await response.json();
      })
    );
  });

  return Promise.all(requests);
};

/**
 * Calculate the tile size based on map location, creating roughly one tile per 256px
 * screen segment.
 *
 * @param map Current map instance
 */
const getTileSize = (map: Leaflet.Map): [number, number] => {
  const pixelTileSize = 256; // Standard web map tile size

  // Convert one tile width in pixels to geographic width
  const center = map.getCenter();
  const point = map.latLngToLayerPoint(center);
  const offsetX = point.add([pixelTileSize, 0]);
  const offsetY = point.add([0, pixelTileSize]);

  const latLngEast = map.layerPointToLatLng(offsetX);
  const latLngSouth = map.layerPointToLatLng(offsetY);

  const lngDiff = latLngEast.lng - center.lng;
  const latDiff = center.lat - latLngSouth.lat;

  return [lngDiff, latDiff];
};

/**
 * Transform a tile back to coordinates bounds.
 *
 * @param tile The tile to transform.
 * @param map The current map instance, used to calculate the tile size.
 */
const tileToBounds = (tile: Tile, map: Leaflet.Map): Leaflet.LatLngBounds => {
  const [tileLngSize, tileLatSize] = getTileSize(map);
  const {x, y} = tile;
  const west = x * tileLngSize;
  const south = y * tileLatSize;
  const east = (x + 1) * tileLngSize;
  const north = (y + 1) * tileLatSize;

  return Leaflet.latLngBounds(Leaflet.latLng(south, west), Leaflet.latLng(north, east));
};

/**
 * Turn latitude, longitude into map tile.
 *
 * @param lat Latitude coordinates for tile.
 * @param lng Longitude coordinates for tile.
 * @param map The map instance, used to calculate the tile sizes.
 */
const latLngToTile = (lat: number, lng: number, map: Leaflet.Map): Tile => {
  const [tileLngSize, tileLatSize] = getTileSize(map);
  const x = Math.floor(lng / tileLngSize);
  const y = Math.floor(lat / tileLatSize);
  return {x, y};
};

/**
 * Get the map tiles based on coordinates.
 *
 * @param bounds Map coordinates bounds to transform into map tiles.
 * @param map Map instance, used to calculate the tile sizes.
 */
const getTilesFromBounds = (bounds: Leaflet.LatLngBounds, map: Leaflet.Map): Tile[] => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const tileMin = latLngToTile(sw.lat, sw.lng, map);
  const tileMax = latLngToTile(ne.lat, ne.lng, map);

  const tiles = [];
  for (let x = tileMin.x; x <= tileMax.x; x++) {
    for (let y = tileMin.y; y <= tileMax.y; y++) {
      tiles.push({x, y});
    }
  }
  return tiles;
};

/**
 * Turn tile and zoom level into a unique key.
 *
 * @param tile Tile to stringify.
 * @param zoom Current map zoom level.
 */
const getTileKey = (tile: Tile, zoom: number) => {
  return `${zoom}:${tile.x},${tile.y}`;
};

export {fetchFeatureCollections, getTileKey, getTilesFromBounds};
