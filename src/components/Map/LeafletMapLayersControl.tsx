import type {MapComponentSchema} from '@open-formulieren/types';
import {
  LayersControl as LeafletLayersControl,
  WMSTileLayer as LeafletWMSTileLayer,
} from 'react-leaflet';

import './LeafletMapLayersControl.scss';
import type {Overlay} from './types';

interface TileLayerProps {
  overlay: Overlay;
}

const WMSTileLayer: React.FC<TileLayerProps> = ({overlay}) => (
  <LeafletWMSTileLayer
    url={overlay.url}
    params={{
      format: 'image/png',
      layers: overlay.layers.join(','),
      transparent: true,
    }}
  />
);

export const overlayTileLayer: Partial<Record<Overlay['type'], React.ElementType<TileLayerProps>>> =
  {
    wms: WMSTileLayer,
  };

interface LayersControlProps {
  overlays: MapComponentSchema['overlays'];
  withoutControl?: boolean;
}

const LayersControl: React.FC<LayersControlProps> = ({overlays, withoutControl = false}) => {
  if (!overlays?.length) {
    return null;
  }

  // In some situations (like the summary), we don't want to show the overlay control,
  // but we still want to render the overlays.
  return withoutControl ? (
    <>
      {overlays.map((layer, index) => {
        const OverlayTileLayer = overlayTileLayer[layer.type];
        return OverlayTileLayer ? <OverlayTileLayer key={index} overlay={layer} /> : null;
      })}
    </>
  ) : (
    <LeafletLayersControl position="topright">
      {overlays.map((layer, index) => {
        const OverlayTileLayer = overlayTileLayer[layer.type];
        return OverlayTileLayer ? (
          <LeafletLayersControl.Overlay name={layer.label} key={index} checked>
            <OverlayTileLayer overlay={layer} />
          </LeafletLayersControl.Overlay>
        ) : null;
      })}
    </LeafletLayersControl>
  );
};

export default LayersControl;
