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
