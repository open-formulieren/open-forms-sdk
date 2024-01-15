import {GeoSearchControl} from 'leaflet-geosearch';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, {useCallback, useContext, useEffect} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {MapContainer, Marker, TileLayer, useMap, useMapEvent} from 'react-leaflet';
import {useGeolocation} from 'react-use';

import {ConfigContext} from 'Context';
import {CRS_RD, DEFAULT_LAT_LNG, DEFAULT_ZOOM, TILE_LAYER_RD} from 'map/constants';
import {getBEMClassName} from 'utils';

import NearestAddress from './NearestAddress';
import OpenFormsProvider from './provider';

const searchControlMessages = defineMessages({
  buttonLabel: {
    description: "The leaflet map's search button areaLabel text.",
    defaultMessage: 'Map component search button',
  },
  searchLabel: {
    description: "The leaflet map's input fields placeholder message.",
    defaultMessage: 'Enter address, please',
  },
  notFound: {
    description: "The leaflet map's location not found message.",
    defaultMessage: 'Sorry, that address could not be found.',
  },
});

const leafletGestureHandlingText = defineMessages({
  touch: {
    description: 'Gesturehandeling phone touch message.',
    defaultMessage: 'Use two fingers to move the map',
  },
  scroll: {
    description: 'Gesturehandeling pc scroll message.',
    defaultMessage: 'Use ctrl + scroll to zoom the map',
  },
  scrollMac: {
    description: 'Gesturehandeling mac scroll message.',
    defaultMessage: 'Use \u2318 + scroll to zoom the map',
  },
});

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

const LeaftletMap = ({
  markerCoordinates,
  onMarkerSet,
  defaultCenter = DEFAULT_LAT_LNG,
  defaultZoomLevel = DEFAULT_ZOOM,
  disabled = false,
}) => {
  const intl = useIntl();
  const defaultCoordinates = useDefaultCoordinates();
  const coordinates = markerCoordinates || defaultCoordinates;

  const onWrapperMarkerSet = coordinates => {
    const coordinatesChanged = !isEqual(markerCoordinates, coordinates);
    if (!coordinatesChanged) return;
    onMarkerSet(coordinates);
  };

  const modifiers = disabled ? ['disabled'] : [];
  const className = getBEMClassName('leaflet-map', modifiers);

  return (
    <>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoomLevel}
        continuousWorld
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
        <TileLayer {...TILE_LAYER_RD} />
        {coordinates ? (
          <>
            <MapView coordinates={coordinates} />
            <MarkerWrapper position={coordinates} onMarkerSet={onWrapperMarkerSet} />
          </>
        ) : null}
        <SearchControl
          onMarkerSet={onMarkerSet}
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
        {disabled ? <DisabledMapControls /> : <CaptureClick setMarker={onMarkerSet} />}
      </MapContainer>
      {markerCoordinates && markerCoordinates.length && (
        <NearestAddress coordinates={markerCoordinates} />
      )}
    </>
  );
};

LeaftletMap.propTypes = {
  markerCoordinates: PropTypes.arrayOf(PropTypes.number),
  onMarkerSet: PropTypes.func,
  disabled: PropTypes.bool,
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

  const setMarker = useCallback(
    result => {
      if (result.location) {
        onMarkerSet([result.location.y, result.location.x]);
      }
    },
    [onMarkerSet]
  );

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
    map.on('geosearch/showlocation', setMarker);

    return () => {
      map.off('geosearch/showlocation', setMarker);
      map.removeControl(searchControl);
    };
  }, [
    map,
    setMarker,
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

const MarkerWrapper = ({position, onMarkerSet, ...props}) => {
  const shouldSetMarker = !!(position && position.length === 2);

  useEffect(() => {
    if (!shouldSetMarker) return;
    if (!onMarkerSet) return;
    onMarkerSet(position);
  });

  // only render a marker if we explicitly have a marker
  return shouldSetMarker ? <Marker position={position} {...props} /> : null;
};

MarkerWrapper.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  onMarkerSet: PropTypes.func,
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

const CaptureClick = ({setMarker}) => {
  useMapEvent('click', event => {
    const newLatLng = [event.latlng.lat, event.latlng.lng];
    setMarker(newLatLng);
  });
  return null;
};

CaptureClick.propTypes = {
  setMarker: PropTypes.func.isRequired,
};

export default LeaftletMap;
