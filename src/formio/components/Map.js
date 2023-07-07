/**
 * A form widget to select a location on a Leaflet map.
 */
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';

import LeafletMap from 'components/Map';
import {DEFAULT_LAT_LON, MAP_DEFAULTS} from 'map/constants';

const Field = Formio.Components.components.field;

export default class Map extends Field {
  static schema(...extend) {
    return Field.schema(
      {
        type: 'map',
        label: 'Map',
        key: 'map',
      },
      ...extend
    );
  }

  static get builderInfo() {
    return {
      title: 'Map',
      icon: 'map',
      weight: 500,
      schema: Map.schema(),
    };
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

  /**
   * Check if a component is eligible for multiple validation.
   *
   * Overridden to not perform this, since values are arrays of [lat, long] which *looks*
   * like multi-value but isn't.
   *
   * @return {boolean}
   */
  validateMultiple() {
    return false;
  }

  render() {
    return super.render(
      `<div ref="element">
        ${this.renderTemplate('map')}
      </div>`
    );
  }

  /**
   * Defer to React to actually render things - this keeps components DRY.
   * @param  {[type]} element [description]
   * @return {[type]}     [description]
   */
  attach(element) {
    this.loadRefs(element, {
      mapContainer: 'single',
    });
    return super.attach(element).then(() => {
      this.reactRoot = createRoot(this.refs.mapContainer);
      this.renderReact();
    });
  }

  destroy() {
    const container = this.refs.mapContainer;
    container && this.reactRoot.unmount();
    super.destroy();
  }

  onMarkerSet(newLatLng) {
    this.setValue(newLatLng, {modified: true});
  }

  setAndReturnCoordinates(coordinates) {
    this.onMarkerSet(coordinates);
    return coordinates;
  }

  renderReact() {
    const startingPop = [this.component.lat, this.component.lng] || DEFAULT_LAT_LON;
    const markerCoordinates =
      this.getValue().length === 2 ? this.getValue() : this.setAndReturnCoordinates(startingPop);

    const container = this.refs.mapContainer;
    const zoom = Number(this.component.defaultZoom);
    // no container node ready (yet), defer to next render cycle
    if (!container) return;

    this.reactRoot.render(
      <LeafletMap
        markerCoordinates={markerCoordinates}
        onMarkerSet={this.onMarkerSet.bind(this)}
        zoomLevel={zoom || MAP_DEFAULTS.zoom}
      />
    );
  }

  setValue(value, flags = {}) {
    const changed = super.setValue(value, flags);
    // re-render if the value is set, which may be because of existing submission data
    changed && this.renderReact();
    return changed;
  }
}
