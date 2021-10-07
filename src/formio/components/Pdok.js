/**
 * A form widget to select a location on a Leaflet map.
 */
import {Formio} from 'react-formio';
import * as L from 'leaflet';
import {RD_CRS} from './rd';

// fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "http://localhost:8000/static/bundles/images/marker-icon-2x.png",
  iconUrl: "http://localhost:8000/static/bundles/images/marker-icon.png",
  shadowUrl: "http://localhost:8000/static/bundles/images/marker-shadow.png",
});

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


const MAP_DEFAULTS = {
  continuousWorld: true,
  crs: RD_CRS,
  attributionControl: true,
  center: DEFAULT_LAT_LON,
  zoom: 3,
};


export default class Pdok extends TextFieldComponent {
  static schema(...extend) {
    return TextFieldComponent.schema({
      type: 'pdok',
      label: 'PDOK kaart',
      key: 'pdokMap',
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Pdok Map',
      group: 'advanced',
      icon: 'map',
      weight: 500,
      schema: Pdok.schema()
    };
  }

  get inputInfo() {
    const info = super.elementInfo();
    // Hide the input element
    info.attr.type = 'hidden';
    return info;
  }

  get defaultSchema() {
    return Pdok.schema();
  }

  get emptyValue() {
    return '';
  }

  renderElement(value, index) {
    return super.renderElement(value, index) + `<div id="the-pdok-map-${this.id}" style="height: 400px; position: relative;"/>`;
  }

  attachElement(element, index) {
    super.attachElement(element, index);

    let map = L.map(`the-pdok-map-${this.id}`, MAP_DEFAULTS);

    const tiles = L.tileLayer(TILE_LAYERS.url, TILE_LAYERS.options);

    map.addLayer(tiles);

    this.setValue(DEFAULT_LAT_LON);

    let marker;

    // Attempt to get the user's current location and set the marker to that
    // If not possible get to the default lat lng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLatLng = [position.coords.latitude, position.coords.longitude];
        marker = L.marker(newLatLng).addTo(map);
        this.setValue(newLatLng);
      }, (error) => {
        marker = L.marker(DEFAULT_LAT_LON).addTo(map);
        this.setValue(DEFAULT_LAT_LON);
      });
    } else {
      marker = L.marker(DEFAULT_LAT_LON).addTo(map);
      this.setValue(DEFAULT_LAT_LON);
    }

    map.on('click', (e) => {
      map.removeLayer(marker);
      const newLatLng = [e.latlng.lat, e.latlng.lng];
      marker = L.marker(newLatLng).addTo(map);
      this.setValue(newLatLng);
    });
  }
}
