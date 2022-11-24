import isEqual from 'lodash/isEqual';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useGeolocation} from 'react-use';

import {MapContainer, TileLayer, Marker, useMap, useMapEvent} from 'react-leaflet';

import {TILE_LAYERS, DEFAULT_LAT_LON, DEFAULT_ZOOM, MAP_DEFAULTS} from 'map/constants';
import {getBEMClassName} from 'utils';

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
    return DEFAULT_LAT_LON;
  }
  if (!navigator.geolocation) return DEFAULT_LAT_LON;
  if (loading) return null;
  return [latitude, longitude];
};

const LeaftletMap = ({markerCoordinates, onMarkerSet, disabled = false}) => {
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
    <MapContainer
      center={MAP_DEFAULTS.center}
      zoom={MAP_DEFAULTS.zoom}
      continuousWorld
      crs={MAP_DEFAULTS.crs}
      attributionControl
      className={className}
    >
      <TileLayer url={TILE_LAYERS.url} {...TILE_LAYERS.options} />
      {coordinates ? (
        <>
          <MapView coordinates={coordinates} />
          <MarkerWrapper position={coordinates} onMarkerSet={onWrapperMarkerSet} />
        </>
      ) : null}
      {disabled ? <DisabledMapControls /> : <CaptureClick setMarker={onMarkerSet} />}
    </MapContainer>
  );
};

LeaftletMap.propTypes = {
  markerCoordinates: PropTypes.arrayOf(PropTypes.number),
  onMarkerSet: PropTypes.func,
  disabled: PropTypes.bool,
};

// Set the map view if coordinates are provided
const MapView = ({coordinates = null, zoomLevel = DEFAULT_ZOOM}) => {
  const map = useMap();
  useEffect(() => {
    if (!coordinates || coordinates.length !== 2) return;
    if (!coordinates.filter(value => isFinite(value)).length === 2) return;
    map.setView(coordinates, zoomLevel);
  });
  // rendering is done by leaflet, so just return null
  return null;
};

MapView.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number),
  zoomLevel: PropTypes.number,
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
