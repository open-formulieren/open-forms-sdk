import * as Leaflet from 'leaflet';

/**
 * Overload the Leaflet-Draw Polyline control, to support "delete last vertex" feature.
 *
 * Update the "deleteLastVertex" functionality of the Leaflet-Draw Polyline control to
 * remove the entire polyline when only one vertex is present. By default, the
 * "deleteLastVertex" is canceled when only one vertex is drawn.
 *
 * Because the Polygon control is an extension of the Polyline control, this
 * "delete last vertex" function will also work when drawing Polygons.
 */
const overloadLeafletDrawPolylineControl = () => {
  // Save original method
  const originalDeleteLastVertex = Leaflet.Draw.Polyline.prototype.deleteLastVertex;

  Leaflet.Draw.Polyline.include({
    deleteLastVertex: function () {
      if (this._markers?.length <= 1) {
        // Remove poly-shape from map
        if (this._poly) {
          this._map.removeLayer(this._poly);
        }

        // Also clear the markers
        this._markers.forEach((marker: Leaflet.Marker) => this._map.removeLayer(marker));
        this._markers = [];

        // Cancel drawing session
        this.disable();
        return;
      }

      // Otherwise run default behavior
      return originalDeleteLastVertex.call(this);
    },
  });
};

export {overloadLeafletDrawPolylineControl};
