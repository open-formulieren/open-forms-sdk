import {MapComponentSchema} from '@open-formulieren/types';
import {LayersControl as LeafletLayersControl, WMSTileLayer} from 'react-leaflet';

import type {Overlay} from './types';

interface TileLayerControlProps {
  overlay: Overlay;
  index: number;
}

const WMSTileLayerControl: React.FC<TileLayerControlProps> = ({index, overlay}) => (
  <LeafletLayersControl.Overlay name={overlay.label} key={index} checked>
    <WMSTileLayer
      url={overlay.url}
      params={{
        format: 'image/png',
        layers: overlay.layers.join(','),
        transparent: true,
      }}
    />
  </LeafletLayersControl.Overlay>
);

export const overlayTileLayerControls: Partial<
  Record<Overlay['type'], React.ElementType<TileLayerControlProps>>
> = {
  wms: WMSTileLayerControl,
};

interface LayersControlProps {
  overlays: MapComponentSchema['overlays'];
}

const LayersControl: React.FC<LayersControlProps> = ({overlays}) => {
  if (!overlays?.length) {
    return null;
  }

  return (
    <LeafletLayersControl position="topright">
      {overlays.map((layer, index) => {
        const Component = overlayTileLayerControls[layer.type];
        return Component ? <Component key={index} index={index} overlay={layer} /> : null;
      })}
    </LeafletLayersControl>
  );
};

export default LayersControl;
