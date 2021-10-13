import {useContext, useEffect} from 'react';
import _uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import {ConfigContext} from 'Context';

import * as L from 'leaflet';
import { TILE_LAYERS, DEFAULT_LAT_LON, DEFAULT_ZOOM, MAP_DEFAULTS } from '../map/constants';


const Map = ({ disabled=false, initialCoordinates=DEFAULT_LAT_LON }) => {

  const mapId = _uniqueId('map-');
  const {baseUrl} = useContext(ConfigContext);

  const initializeInteractableMap = (map, marker) => {
      // Attempt to get the user's current location and set the marker to that
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          map.removeLayer(marker);
          const newLatLng = [position.coords.latitude, position.coords.longitude];
          marker = L.marker(newLatLng).addTo(map);
          map.setView(newLatLng, DEFAULT_ZOOM);
        });
      }

      map.on('click', (e) => {
        map.removeLayer(marker);
        const newLatLng = [e.latlng.lat, e.latlng.lng];
        marker = L.marker(newLatLng).addTo(map);
      });
  };

  const disableMap = (map) => {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) map.tap.disable();
      document.getElementById(mapId).style.cursor = 'default';
  };

  useEffect(() => {
    // fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: `${baseUrl.replaceAll("/api/v1/", "")}/static/bundles/images/marker-icon-2x.png`,
      iconUrl: `${baseUrl.replaceAll("/api/v1/", "")}/static/bundles/images/marker-icon.png`,
      shadowUrl: `${baseUrl.replaceAll("/api/v1/", "")}/static/bundles/images/marker-shadow.png`,
    });

    // Prevent exception if container is already initialized
    const container = L.DomUtil.get(mapId);
    if (container !== null) {
      container._leaflet_id = null;
    }

    const map = L.map(mapId, MAP_DEFAULTS);

    const tiles = L.tileLayer(TILE_LAYERS.url, TILE_LAYERS.options);

    map.addLayer(tiles);
    map.setView(initialCoordinates, DEFAULT_ZOOM);

    let marker = L.marker(initialCoordinates).addTo(map);

    if (disabled) {
      disableMap(map);
    } else {
      initializeInteractableMap(map, marker);
    }
  });

  return (
    <div id={mapId} style={{ height: "400px", position: "relative" }}/>
  );
};


Map.propTypes = {
  disabled: PropTypes.bool,
  initialCoordinates: PropTypes.array,
};


export default Map;
