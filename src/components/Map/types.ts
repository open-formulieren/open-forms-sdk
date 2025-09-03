export type Coordinates = [number, number];

type PointGeometry = {
  type: 'Point';
  coordinates: Coordinates;
};

type LineGeometry = {
  type: 'LineString';
  coordinates: Coordinates[];
};

type PolygonGeometry = {
  type: 'Polygon';
  coordinates: Coordinates[][];
};

export type GeoJsonGeometry = PointGeometry | LineGeometry | PolygonGeometry;

export type MapInteractions = {
  marker: boolean;
  polygon: boolean;
  polyline: boolean;
};

export type WMSTileLayer = {
  uuid: string;
  url: string;
  label: string;
  layers: string[];
};
