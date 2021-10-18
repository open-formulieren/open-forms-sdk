import React, {useEffect, useRef} from 'react';
import _uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import {useGeolocation} from 'react-use';


import L from 'leaflet';
import { TILE_LAYERS, DEFAULT_LAT_LON, DEFAULT_ZOOM, MAP_DEFAULTS } from '../map/constants';


const useDefaultCoordinates = () => {
  // FIXME: can't call hooks conditionally
  const { loading, latitude, longitude } = useGeolocation();
  if (!navigator.geolocation) return [false, DEFAULT_LAT_LON];
  return [loading, [latitude, longitude]];
};


const LeaftletMap = ({
  markerCoordinates,
  onMarkerSet,
  disabled=false,
}) => {
  const containerRef = useRef();
  const mapRef = useRef();
  const markerRef = useRef();

  const [geoLoading, defaultCoordinates] = useDefaultCoordinates();
  const coordinates = markerCoordinates || defaultCoordinates;

  const initializeInteractiveMap = () => {
    const map = mapRef.current;
    let marker = markerRef.current;

    map.on('click', (e) => {
      map.removeLayer(marker);
      const newLatLng = [e.latlng.lat, e.latlng.lng];
      onMarkerSet(newLatLng);
      marker = L.marker(newLatLng).addTo(map);
      markerRef.current = marker;
    });
  };

  const disableMap = () => {
      const map = mapRef.current;
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) map.tap.disable();
      containerRef.current.style.cursor = 'default';
  };

  const destroyMap = () => {
    const map = mapRef.current;
    markerRef.current = null;
    // containerRef.current = null;
    if (!map) return;
    map.remove();
    mapRef.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;

    // no container div rendered yet, we can't initialize the map yet.
    if (!container) {
      return;
    }

    let map = mapRef.current;
    let marker = markerRef.current;

    // if no map instance exists yet, create it and set the ref.
    if (!map) {
      map = L.map(container, MAP_DEFAULTS);
      mapRef.current = map;

      // set the base layers that are always present for any map whatever the value is
      const tiles = L.tileLayer(TILE_LAYERS.url, TILE_LAYERS.options);
      map.addLayer(tiles);
    }

    // okay, now ensure that the coordinates are in view - this happens for initial and
    // re-renders (so if an instance already exists!)
    if (markerCoordinates || !geoLoading) {
      map.setView(coordinates, DEFAULT_ZOOM);

      // ensure a marker is rendered
      if (!marker) {
        marker = L.marker(coordinates).addTo(map);
        markerRef.current = marker;
      }
    }

    if (disabled) {
      disableMap();
    } else {
      initializeInteractiveMap();
    }

    // destroy the map on un-mount/cleanup cycle.
    return destroyMap;
  });

  return (
    <div
      ref={containerRef}
      id={_uniqueId('map-')}
      style={{ height: "400px", position: "relative" }}
    />
  );
};


LeaftletMap.propTypes = {
  markerCoordinates: PropTypes.arrayOf(PropTypes.number),
  onMarkerSet: PropTypes.func,
  disabled: PropTypes.bool,
};


export default LeaftletMap;
