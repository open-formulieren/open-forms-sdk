/**
 * A form widget to select a location on a Leaflet map.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {Formio} from 'react-formio';

import LeafletMap from 'components/Map';

const Field = Formio.Components.components.field;


export default class Map extends Field {
  static schema(...extend) {
    return Field.schema({
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
    return super
      .attach(element)
      .then(() => this.renderReact());
  }

  destroy() {
    const container = this.refs.mapContainer;
    container && ReactDOM.unmountComponentAtNode(container);
    super.destroy();
  }

  onMarkerSet(newLatLng) {
    this.setValue(newLatLng, {modified: true});
  }

  renderReact() {
    const markerCoordinates = this.getValue();
    const container = this.refs.mapContainer;
    // no container node ready (yet), defer to next render cycle
    if (!container) return;

    ReactDOM.render(
      <LeafletMap
        markerCoordinates={markerCoordinates || null}
        onMarkerSet={this.onMarkerSet.bind(this)}
      />,
      container,
    );
  }

  setValue(value, flags={}) {
    const changed = super.setValue(value, flags);
    // re-render if the value is set, which may be because of existing submission data
    changed && this.renderReact();
    return changed;
  }
}
