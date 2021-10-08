/**
 * A form widget to select a location on a Leaflet map.
 */
import {Formio} from 'react-formio';
import * as L from 'leaflet';
import {RD_CRS} from './rd';

const TextFieldComponent = Formio.Components.components.textfield;

const TILES = 'https://geodata.nationaalgeoregister.nl/tiles/service';

const ATTRIBUTION = `
    Kaartgegevens &copy;
    <a href="https://www.kadaster.nl">Kadaster</a> |
    <a href="https://www.verbeterdekaart.nl">Verbeter de kaart</a>
`;

const TILE_LAYERS = {
  url: `${TILES}/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png`,
  options: {
    minZoom: 1,
    maxZoom: 13,
    attribution: ATTRIBUTION,
  },
};


// Roughly the center of the Netherlands
const DEFAULT_LAT_LON = [52.1326332, 5.291266];
const DEFAULT_ZOOM = 13;


const MAP_DEFAULTS = {
  continuousWorld: true,
  crs: RD_CRS,
  attributionControl: true,
  center: DEFAULT_LAT_LON,
  zoom: DEFAULT_ZOOM,
};


export default class Map extends TextFieldComponent {
  static schema(...extend) {
    return TextFieldComponent.schema({
      type: 'map',
      label: 'Map',
      key: 'map',
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Map',
      icon: 'map',
      weight: 500,
      schema: Map.schema()
    };
  }

  constructor(component, options, data) {
    super(component, options, data);

    // Update this check since we set the value to an array
    this.validator.validators.multiple.check = (component, setting, value) => Array.isArray(value);

    // fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
    delete L.Icon.Default.prototype._getIconUrl;

    const baseUrl = this.options.baseUrl.replaceAll("/api/v1/", "");

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: `${baseUrl}/static/bundles/images/marker-icon-2x.png`,
      iconUrl: `${baseUrl}/static/bundles/images/marker-icon.png`,
      shadowUrl: `${baseUrl}/static/bundles/images/marker-shadow.png`,
    });
  }

  get inputInfo() {
    const info = super.elementInfo();
    // Hide the input element
    info.attr.type = 'hidden';
    return info;
  }

  get defaultSchema() {
    return Map.schema();
  }

  get emptyValue() {
    return '';
  }

  renderElement(value, index) {
    return super.renderElement(value, index) + `<div id="map-${this.id}" style="height: 400px; position: relative;"/>`;
  }

  attachElement(element, index) {
    super.attachElement(element, index);

    // Prevent exception if container is already initialized
    const container = L.DomUtil.get(`map-${this.id}`);
    if (container !== null) {
      container._leaflet_id = null;
    }

    let map = L.map(`map-${this.id}`, MAP_DEFAULTS);

    const tiles = L.tileLayer(TILE_LAYERS.url, TILE_LAYERS.options);

    map.addLayer(tiles);

    let marker = L.marker(DEFAULT_LAT_LON).addTo(map);
    this.setValue(DEFAULT_LAT_LON);

    // Attempt to get the user's current location and set the marker to that
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.removeLayer(marker);
        const newLatLng = [position.coords.latitude, position.coords.longitude];
        marker = L.marker(newLatLng).addTo(map);
        map.setView(newLatLng, DEFAULT_ZOOM);
        this.setValue(newLatLng);
      });
    }

    map.on('click', (e) => {
      map.removeLayer(marker);
      const newLatLng = [e.latlng.lat, e.latlng.lng];
      marker = L.marker(newLatLng).addTo(map);
      this.setValue(newLatLng);
    });
  }
}
