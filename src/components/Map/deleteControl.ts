import * as Leaflet from 'leaflet';
import {FeatureGroup as LeafletFeatureGroup} from 'leaflet';
import type {RefObject} from 'react';
import {IntlShape} from 'react-intl';

/**
 * Overload the Leaflet-Draw delete control, to support "one-click" deletion of all
 * shapes.
 *
 * Update the "onclick" functionality of the Leaflet-Draw delete control to remove the
 * "delete menu" popup. Instead, just delete all shapes. To prevent accidental deletion,
 * a confirmation message will appear.
 *
 * @param featureGroupRef React ref to the FeatureGroup component
 * @param intl React-intl instance
 */
const overloadLeafletDeleteControl = (
  featureGroupRef: RefObject<LeafletFeatureGroup>,
  intl: IntlShape
) => {
  const deleteShapeConfirmMessage = intl.formatMessage({
    description: 'Leaflet map: delete drawn shape confirmation message',
    defaultMessage: 'Are you sure you want to delete your drawn shape?',
  });
  Leaflet.EditToolbar.Delete.include({
    enable: function () {
      if (!window.confirm(deleteShapeConfirmMessage)) return;

      const featureGroup = featureGroupRef.current;
      if (!featureGroup) return;

      // Collect all current layers/shapes
      const layers = new Leaflet.LayerGroup();
      featureGroup.eachLayer((layer: Leaflet.Layer) => layers.addLayer(layer));

      // Delete all shapes
      featureGroup.clearLayers();

      // Trigger "shapes deleted" Leaflet event, and mark control as disabled.
      this._map.fire(Leaflet.Draw.Event.DELETED, {layers});
      this.disable();
    },
  });
};

export {overloadLeafletDeleteControl};
