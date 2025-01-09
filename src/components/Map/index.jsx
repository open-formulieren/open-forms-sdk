import * as Leaflet from 'leaflet';
import {GeoSearchControl} from 'leaflet-geosearch';
import PropTypes from 'prop-types';
import {useContext, useEffect, useRef} from 'react';
import {useIntl} from 'react-intl';
import {FeatureGroup, MapContainer, TileLayer, useMap} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {useGeolocation} from 'react-use';

import {ConfigContext} from 'Context';
import {
  CRS_RD,
  DEFAULT_INTERACTIONS,
  DEFAULT_LAT_LNG,
  DEFAULT_ZOOM,
  TILE_LAYER_RD,
} from 'map/constants';
import {getBEMClassName} from 'utils';

import NearestAddress from './NearestAddress';
import './map.scss';
import OpenFormsProvider from './provider';
import {
  applyLeafletTranslations,
  leafletGestureHandlingText,
  searchControlMessages,
} from './translations';

const useDefaultCoordinates = () => {
  // FIXME: can't call hooks conditionally
  const {loading, latitude, longitude, error} = useGeolocation();
  // it's possible the user declined permissions (error.code === 1) to access the
  // location, or the location could not be determined. In that case, fall back to the
  // hardcoded default. See Github issue
  // https://github.com/open-formulieren/open-forms/issues/864 and the docs on
  // GeolocationPositionError:
  // https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
  if (error) {
    return null;
  }
  if (!navigator.geolocation) return null;
  if (loading) return null;
  return [latitude, longitude];
};

const getCoordinates = geoJsonFeature => {
  if (!geoJsonFeature) {
    return null;
  }

  const center = Leaflet.geoJSON(geoJsonFeature).getBounds().getCenter();
  return [center.lat, center.lng];
};

const LeaftletMap = ({
  geoJsonFeature,
  onGeoJsonFeatureSet,
  defaultCenter = DEFAULT_LAT_LNG,
  defaultZoomLevel = DEFAULT_ZOOM,
  disabled = false,
  interactions = DEFAULT_INTERACTIONS,
  tileLayerUrl = TILE_LAYER_RD.url,
}) => {
  const featureGroupRef = useRef();
  const intl = useIntl();
  const defaultCoordinates = useDefaultCoordinates();
  const geoJsonCoordinates = getCoordinates(geoJsonFeature);
  const coordinates = geoJsonCoordinates ?? defaultCoordinates;

  const modifiers = disabled ? ['disabled'] : [];
  const className = getBEMClassName('leaflet-map', modifiers);

  applyLeafletTranslations(intl);

  const onFeatureCreate = event => {
    updateGeoJsonFeature(event.layer);
  };

  const onFeatureDelete = () => {
    // The value `null` is needed to make sure that Formio actually updates the value.
    // node_modules/formiojs/components/_classes/component/Component.js:2528
    onGeoJsonFeatureSet(null);
  };

  const onSearchMarkerSet = event => {
    updateGeoJsonFeature(event.marker);
  };

  const updateGeoJsonFeature = newFeatureLayer => {
    if (featureGroupRef.current) {
      const newFeatureLayerId = newFeatureLayer._leaflet_id;
      const layers = featureGroupRef.current?.getLayers();
      // Limit the amount of features to 1, by removing the previous layer
      if (layers.length > 1) {
        const oldLayerIds = layers
          .map(layer => layer._leaflet_id)
          .filter(layerId => layerId !== newFeatureLayerId);
        oldLayerIds.forEach(oldLayerId => {
          featureGroupRef.current?.removeLayer(oldLayerId);
        });
      }
    }
    onGeoJsonFeatureSet(newFeatureLayer.toGeoJSON());
  };

  return (
    <>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoomLevel}
        crs={CRS_RD}
        attributionControl
        className={className}
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
        <TileLayer {...TILE_LAYER_RD} url={tileLayerUrl} />
        <FeatureGroup ref={featureGroupRef}>
          {!disabled && (
            <EditControl
              position="topright"
              onCreated={onFeatureCreate}
              onDeleted={onFeatureDelete}
              edit={{
                edit: false,
              }}
              draw={{
                rectangle: false,
                circle: false,
                polyline: !!interactions?.polyline,
                polygon: !!interactions?.polygon,
                marker: !!interactions?.marker,
                circlemarker: false,
              }}
            />
          )}
        </FeatureGroup>
        {coordinates && <MapView coordinates={coordinates} />}
        {!disabled && (
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
        )}
        {disabled && <DisabledMapControls />}
      </MapContainer>
      {geoJsonCoordinates && geoJsonCoordinates.length && (
        <NearestAddress coordinates={geoJsonCoordinates} />
      )}
    </>
  );
};

LeaftletMap.propTypes = {
  geoJsonFeature: PropTypes.shape({
    type: PropTypes.oneOf(['Feature']).isRequired,
    properties: PropTypes.object,
    geometry: PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.oneOf(['Point']).isRequired,
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
      }),
      PropTypes.shape({
        type: PropTypes.oneOf(['LineString']).isRequired,
        coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      }),
      PropTypes.shape({
        type: PropTypes.oneOf(['Polygon']).isRequired,
        coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)))
          .isRequired,
      }),
    ]).isRequired,
  }),
  onGeoJsonFeatureSet: PropTypes.func,
  interactions: PropTypes.shape({
    polyline: PropTypes.bool,
    polygon: PropTypes.bool,
    marker: PropTypes.bool,
  }),
  disabled: PropTypes.bool,
  tileLayerUrl: PropTypes.string,
};

// Set the map view if coordinates are provided
const MapView = ({coordinates = null}) => {
  const map = useMap();
  useEffect(() => {
    if (!coordinates || coordinates.length !== 2) return;
    if (!coordinates.filter(value => isFinite(value)).length === 2) return;
    map.setView(coordinates);
  }, [map, coordinates]);
  // rendering is done by leaflet, so just return null
  return null;
};

MapView.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number),
};

const SearchControl = ({onMarkerSet, options}) => {
  const {baseUrl} = useContext(ConfigContext);
  const map = useMap();
  const intl = useIntl();

  const {
    showMarker,
    showPopup,
    retainZoomLevel,
    animateZoom,
    autoClose,
    searchLabel,
    keepResult,
    updateMap,
    notFoundMessage,
  } = options;

  const buttonLabel = intl.formatMessage(searchControlMessages.buttonLabel);

  useEffect(() => {
    const provider = new OpenFormsProvider(baseUrl);
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'button',
      showMarker,
      showPopup,
      retainZoomLevel,
      animateZoom,
      autoClose,
      searchLabel,
      keepResult,
      updateMap,
      notFoundMessage,
    });

    searchControl.button.setAttribute('aria-label', buttonLabel);
    map.addControl(searchControl);
    map.on('geosearch/showlocation', onMarkerSet);

    return () => {
      map.off('geosearch/showlocation', onMarkerSet);
      map.removeControl(searchControl);
    };
  }, [
    map,
    onMarkerSet,
    baseUrl,
    showMarker,
    showPopup,
    retainZoomLevel,
    animateZoom,
    autoClose,
    searchLabel,
    keepResult,
    updateMap,
    notFoundMessage,
    buttonLabel,
  ]);

  return null;
};

SearchControl.propTypes = {
  onMarkerSet: PropTypes.func.isRequired,
  options: PropTypes.shape({
    showMarker: PropTypes.bool.isRequired,
    showPopup: PropTypes.bool.isRequired,
    retainZoomLevel: PropTypes.bool.isRequired,
    animateZoom: PropTypes.bool.isRequired,
    autoClose: PropTypes.bool.isRequired,
    searchLabel: PropTypes.string.isRequired,
    keepResult: PropTypes.bool.isRequired,
    updateMap: PropTypes.bool.isRequired,
    notFoundMessage: PropTypes.string.isRequired,
  }),
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
    if (map.tap) map.tap.disable();
  }, [map]);
  return null;
};

export default LeaftletMap;
