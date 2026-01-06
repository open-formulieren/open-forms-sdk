import * as Leaflet from 'leaflet';

import type {Interactions} from './types';

/**
 * Overload the Leaflet-Draw Control.Draw, to add custom "enableDrawingMode" and
 * "disableDrawingMode" features.
 *
 * Leaflet-draw doesn't provide any controls to enable the UI actions programmatically,
 * so we create these controls ourselves. These controls allow us to enable and disable
 * the drawing tools and UI controls.
 * Meaning; we can programmatically enable "drawing mode" AND enable the UI features
 * (i.e., trigger the interaction button, to provide access to the drawing tools
 * `cancel`, `finish shape`, `remove last point`, etc.).
 *
 * Unfortunately, we need to fetch the draw handler from the internal API. Leaflet
 * doesn't expose this any other way.
 */
const overloadLeafletDrawToolbarControls = () => {
  if (
    Leaflet.Control.Draw.prototype.enableDrawingMode &&
    Leaflet.Control.Draw.prototype.disableDrawingMode
  ) {
    return; // prevent double-include (StrictMode!)
  }

  Leaflet.Control.Draw.include({
    enableDrawingMode: function (shape: keyof Interactions) {
      const drawToolbar = this._toolbars?.draw;
      if (!drawToolbar) return;

      const modes: Record<string, {handler: L.Handler}> = drawToolbar._modes;
      const mode = modes?.[shape];
      // If the requested mode is not available, do nothing.
      if (!mode) return;

      // Disable other active modes
      Object.values(modes).forEach(m => {
        if (m.handler.enabled()) {
          m.handler.disable();
        }
      });

      mode.handler.enable();
    },
    disableDrawingMode: function (shape: keyof Interactions) {
      const drawToolbar = this._toolbars?.draw;
      if (!drawToolbar) return;

      const mode: {handler: L.Handler} | undefined = drawToolbar._modes?.[shape];
      // If the requested mode is not available, do nothing.
      if (!mode) return;

      mode.handler.disable();
    },
  });
};

export {overloadLeafletDrawToolbarControls};
