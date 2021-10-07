/**
 * A form widget to select a location on a Leaflet map.
 */
import {Formio} from 'react-formio';
import * as L from 'leaflet';
import { RD_CRS } from './rd';

// Using Hidden Component so we don't get anything 'extra' with our map
const HiddenComponent = Formio.Components.components.hidden;

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


const MAP_DEFAULTS = {
    continuousWorld: true,
    crs: RD_CRS,
    attributionControl: true,
    center: [52.1326332, 5.291266],
    zoom: 3,
};


export default class Pdok extends HiddenComponent {
    static schema(...extend) {
        return HiddenComponent.schema({
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

        // var mymap = L.map('the-pdok-map').setView([51.505, -0.09], 13);

        // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //     maxZoom: 18,
        //     id: 'mapbox/streets-v11',
        //     tileSize: 512,
        //     zoomOffset: -1,
        //     accessToken: 'pk.eyJ1Ijoic2hlYW1leWVycyIsImEiOiJja3VncTZpc3gwYnNzMnFteTZjeXp2M3E0In0.v5LSs4Hd4xfrRqInXVy3dw'
        // }).addTo(mymap);

        let map = L.map(`the-pdok-map-${this.id}`, MAP_DEFAULTS);

        const tiles = L.tileLayer(TILE_LAYERS.url, TILE_LAYERS.options);

        map.addLayer(tiles);

        // Set inital marker at center
        let marker = L.marker([52.1326332, 5.291266]).addTo(map);

        map.on('click', (e) => {
          map.removeLayer(marker);
          marker = L.marker(e.latlng).addTo(map);
        });
    }
}
