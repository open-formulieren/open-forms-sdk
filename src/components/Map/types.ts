import type {MapComponentSchema} from '@open-formulieren/types';

export type Coordinates = [number, number];

interface PointGeometry {
  type: 'Point';
  coordinates: Coordinates;
}

interface LineGeometry {
  type: 'LineString';
  coordinates: Coordinates[];
}

interface PolygonGeometry {
  type: 'Polygon';
  coordinates: Coordinates[][];
}

export type GeoJsonGeometry = PointGeometry | LineGeometry | PolygonGeometry;

export type Overlay = NonNullable<MapComponentSchema['overlays']>[number];
export type Interactions = Required<MapComponentSchema>['interactions'];
