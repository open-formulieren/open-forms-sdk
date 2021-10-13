import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import * as L from 'leaflet';
import { TILE_LAYERS, DEFAULT_LAT_LON, DEFAULT_ZOOM, MAP_DEFAULTS } from '../formio/components/map/constants';


const Map = () => {

  useEffect(() => {
    let mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoic2hlYW1leWVycyIsImEiOiJja3VncTZpc3gwYnNzMnFteTZjeXp2M3E0In0.v5LSs4Hd4xfrRqInXVy3dw'
    }).addTo(mymap);
  });

  return (
    <div id="mapid" style={{ height: "400px", position: "relative"}} />
  );
};

export default Map;
