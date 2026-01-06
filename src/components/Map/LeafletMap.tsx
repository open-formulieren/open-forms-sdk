import type {MapComponentSchema} from '@open-formulieren/types';
import * as Leaflet from 'leaflet';
import type {
  Circle,
  CircleMarker,
  Control,
  DrawEvents,
  FeatureGroup as LeafletFeatureGroup,
  Marker,
  Polygon,
  Polyline,
} from 'leaflet';
import {useEffect, useRef} from 'react';
import {useIntl} from 'react-intl';
import {FeatureGroup, MapContainer, TileLayer, useMap} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import {getBEMClassName} from 'utils';

import LayersControl from './LeafletMapLayersControl';
import LocationControl from './LeafletMapLocationControl';
import SearchControl, {type GeoSearchShowLocationEvent} from './LeafletMapSearchControl';
import NearestAddress from './NearestAddress';
import {DEFAULT_INTERACTIONS, DEFAULT_LAT_LNG, DEFAULT_ZOOM} from './constants';
import {overloadLeafletDeleteControl} from './deleteControl';
import {overloadLeafletDrawPolylineControl} from './drawPolylineControl';
import {overloadLeafletDrawToolbarControls} from './drawToolbarControls';
import {CRS_RD, TILE_LAYER_RD, initialize} from './init';
import {
  applyLeafletTranslations,
  leafletGestureHandlingText,
  searchControlMessages,
} from './translations';
import type {Coordinates, GeoJsonGeometry, Interactions} from './types';

// Run some Leaflet-specific patches...
initialize();

const getCoordinates = (geoJsonGeometry: GeoJsonGeometry | undefined): Coordinates | null => {
  if (!geoJsonGeometry) {
    return null;
  }

  const center = Leaflet.geoJSON(geoJsonGeometry).getBounds().getCenter();
  return [center.lat, center.lng];
};

export interface LeafletMapProps {
  geoJsonGeometry?: GeoJsonGeometry;
  onGeoJsonGeometrySet: (newGeoJsonGeometry: GeoJsonGeometry | null) => void;
  defaultCenter?: Coordinates;
  defaultZoomLevel?: number;
  disabled?: boolean;
  interactions?: MapComponentSchema['interactions'];
  tileLayerUrl?: string;
  overlays?: MapComponentSchema['overlays'];
  // To allow storybook to monitor the map instance, a map container child can be added.
  mapContainerChild?: React.ReactNode;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  geoJsonGeometry,
  onGeoJsonGeometrySet,
  defaultCenter = DEFAULT_LAT_LNG,
  defaultZoomLevel = DEFAULT_ZOOM,
  disabled = false,
  interactions = DEFAULT_INTERACTIONS,
  tileLayerUrl = TILE_LAYER_RD.url,
  overlays = [],
  mapContainerChild,
}) => {
  const featureGroupRef = useRef<LeafletFeatureGroup>(null);
  const drawControlRef = useRef<Control.Draw | null>(null);
  const intl = useIntl();
  const geoJsonCoordinates = getCoordinates(geoJsonGeometry);

  const modifiers = disabled ? ['disabled'] : [];
  const className = getBEMClassName('leaflet-map', modifiers);

  // Get the names of the active interactions
  const activeInteractionNames = Object.entries(interactions)
    .filter(([, allow]) => !!allow)
    .map<keyof Interactions>(([interaction]) => interaction as keyof Interactions);
  const singleInteractionMode = activeInteractionNames.length === 1;

  useEffect(() => {
    applyLeafletTranslations(intl);
  }, [intl]);

  useEffect(() => {
    overloadLeafletDeleteControl(featureGroupRef, intl);
  }, [featureGroupRef, intl]);

  useEffect(() => {
    overloadLeafletDrawToolbarControls();
    overloadLeafletDrawPolylineControl();
  }, []);

  const onFeatureCreate = (event: DrawEvents.Created) => {
    updateGeoJsonGeometry(event.layer);
  };

  const onFeatureDelete = () => {
    // The value `null` is needed to make sure that Formio actually updates the value.
    // node_modules/formiojs/components/_classes/component/Component.js:2528
    onGeoJsonGeometrySet?.(null);
  };

  const onSearchMarkerSet = (event: GeoSearchShowLocationEvent) => {
    updateGeoJsonGeometry(event.marker);
  };

  const updateGeoJsonGeometry = (
    newFeatureLayer: Circle | CircleMarker | Marker | Polygon | Polyline
  ) => {
    // Remove all existing shapes from the map, ensuring that shapes are only added through
    // `geoJsonGeometry` changes.
    featureGroupRef.current?.clearLayers();
    onGeoJsonGeometrySet?.(newFeatureLayer.toGeoJSON().geometry);
  };

  return (
    <>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoomLevel}
        minZoom={TILE_LAYER_RD.minZoom}
        maxZoom={TILE_LAYER_RD.maxZoom}
        crs={CRS_RD}
        attributionControl
        className={className}
        // @ts-expect-error searchControl, gestureHandling and gestureHandlingOptions are
        // missing in the props definitions, but definitely being used.
        searchControl
        gestureHandling
        gestureHandlingOptions={{
          text: {
            touch: intl.formatMessage(leafletGestureHandlingText.touch),
            scroll: intl.formatMessage(leafletGestureHandlingText.scroll),
            scrollMac: intl.formatMessage(leafletGestureHandlingText.scrollMac),
          },
          duration: 3000,
        }}
      >
        <EnsureTestId />
        <TileLayer {...TILE_LAYER_RD} url={tileLayerUrl} />
        <LayersControl overlays={overlays} withoutControl={disabled} />
        <FeatureGroup ref={featureGroupRef}>
          {!disabled && (
            <>
              <EditControl
                position="topright"
                onCreated={onFeatureCreate}
                onDeleted={onFeatureDelete}
                onMounted={(drawControl: L.Control.Draw) => {
                  drawControlRef.current = drawControl;
                }}
                edit={{
                  edit: false,
                }}
                draw={{
                  rectangle: false,
                  circle: false,
                  // Add the draw buttons when there is more than 1 active interaction.
                  polyline: !!interactions?.polyline,
                  polygon: !!interactions?.polygon,
                  marker: !!interactions?.marker,
                  circlemarker: false,
                }}
              />
              {singleInteractionMode && (
                <SingleInteractionMode
                  shape={activeInteractionNames[0]}
                  drawControlRef={drawControlRef}
                  geoJsonGeometry={geoJsonGeometry}
                />
              )}
            </>
          )}
          <Geometry geoJsonGeometry={geoJsonGeometry} featureGroupRef={featureGroupRef} />
        </FeatureGroup>
        {geoJsonCoordinates && <MapView coordinates={geoJsonCoordinates} />}
        {!disabled && (
          <>
            <SearchControl
              onMarkerSet={onSearchMarkerSet}
              options={{
                showMarker: false,
                showPopup: false,
                retainZoomLevel: false,
                animateZoom: true,
                autoClose: false,
                searchLabel: intl.formatMessage(searchControlMessages.searchLabel),
                keepResult: true,
                updateMap: true,
                notFoundMessage: intl.formatMessage(searchControlMessages.notFound),
              }}
            />
            <LocationControl />
          </>
        )}
        {disabled && <DisabledMapControls />}
        {mapContainerChild}
      </MapContainer>
      {geoJsonCoordinates && geoJsonCoordinates.length && (
        <NearestAddress coordinates={geoJsonCoordinates} />
      )}
    </>
  );
};

const EnsureTestId = () => {
  const map = useMap();
  const container = map.getContainer();
  useEffect(() => {
    if (!container.dataset.testid) {
      container.dataset.testid = 'leaflet-map';
    }
  }, [container]);
  return null;
};

interface SingleInteractionModeProps {
  geoJsonGeometry?: GeoJsonGeometry;
  drawControlRef: React.RefObject<Control.Draw>;
  shape: keyof Interactions;
}

const SingleInteractionMode: React.FC<SingleInteractionModeProps> = ({
  geoJsonGeometry,
  drawControlRef,
  shape,
}) => {
  const map = useMap();

  useEffect(() => {
    // If there is no map, no draw control ref, or the map already has a value, do nothing.
    if (!map || !drawControlRef.current || !!geoJsonGeometry) return;
    const drawControl = drawControlRef.current;

    // Enable the drawing mode for the provided shape.
    if (drawControl.enableDrawingMode) drawControl.enableDrawingMode(shape);

    return () => {
      // On unmounting, disable the drawing mode.
      if (drawControl.disableDrawingMode) drawControl.disableDrawingMode(shape);
    };
  }, [drawControlRef, geoJsonGeometry, shape, map]);

  return null;
};

interface GeometryProps {
  geoJsonGeometry?: GeoJsonGeometry;
  featureGroupRef: React.RefObject<LeafletFeatureGroup>;
}

const Geometry: React.FC<GeometryProps> = ({geoJsonGeometry, featureGroupRef}) => {
  const map = useMap();

  useEffect(() => {
    if (!featureGroupRef.current) {
      // If there is no feature group, nothing should be done...
      return;
    }

    // Remove all shapes from the map.
    // Only the data from `geoJsonGeometry` should be shown on the map.
    featureGroupRef.current.clearLayers();
    if (!geoJsonGeometry) {
      return;
    }

    // Add the `geoJsonGeometry` data as shape.
    const layer = Leaflet.GeoJSON.geometryToLayer({
      type: 'Feature',
      geometry: geoJsonGeometry,
      properties: {},
    });
    featureGroupRef.current.addLayer(layer);

    // For marker/point elements the zooming doesn't provide any functionality, as it
    // cannot be outside the bounds.
    if (geoJsonGeometry.type !== 'Point') {
      // Update map zoom to fit the shape
      map.fitBounds(Leaflet.geoJSON(geoJsonGeometry).getBounds(), {padding: [1, 1]});
    }
  }, [featureGroupRef, geoJsonGeometry, map]);

  return null;
};

interface MapViewProps {
  coordinates?: Coordinates;
}

// Set the map view if coordinates are provided
const MapView: React.FC<MapViewProps> = ({coordinates = null}) => {
  const map = useMap();
  useEffect(() => {
    if (!coordinates) return;
    if (coordinates.filter(value => isFinite(value)).length !== 2) return;
    map.setView(coordinates);
  }, [map, coordinates]);

  // rendering is done by leaflet, so just return null
  return null;
};

const DisabledMapControls = () => {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.tapHold?.disable();
  }, [map]);
  return null;
};

export default LeafletMap;
