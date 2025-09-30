import type {MapComponentSchema} from '@open-formulieren/types';
import * as Leaflet from 'leaflet';
import {useEffect, useRef} from 'react';
import {
  LayerGroup,
  LayersControl as LeafletLayersControl,
  WMSTileLayer,
  useMap,
} from 'react-leaflet';

import './LeafletMapLayersControl.scss';
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

interface WFSTileLayerProps {
  url: string;
  featureTypes: string[];
}

const WFSTileLayer: React.FC<WFSTileLayerProps> = ({url, featureTypes}) => {
  const map = useMap();
  const groupRef = useRef<Leaflet.LayerGroup>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;

    const fetchData = async () => {
      const bounds = map.getBounds();
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()},EPSG:4326`;

      const baseUrl = new URL(url).href.split('?')[0];

      // PDOK doesn't support multiple feature types in one request, for the outputFormat
      // JSON. So we spread them out to multiple requests, that are then merged into one
      // layer.
      const requests = featureTypes.map(async typeName => {
        const requestUrl =
          `${baseUrl}?service=WFS&version=2.0.0&request=GetFeature&typeNames=${typeName}` +
          `&outputFormat=application/json&srsName=urn:ogc:def:crs:EPSG::4326&bbox=${bbox}`;
        const response = await fetch(requestUrl);
        return await response.json();
      });

      // Remove the previous WFS shapes, and add the new ones
      group.clearLayers();

      const results = await Promise.all(requests);
      results.forEach(data => {
        Leaflet.geoJSON(data, {
          // Styling for features/pins
          pointToLayer: (_, latlng) =>
            Leaflet.marker(latlng, {
              icon: Leaflet.divIcon({
                className:
                  'openforms-leaflet-map-overlay-feature openforms-leaflet-map-overlay-feature--marker',
              }),
            }),
          // Styling for polylines and polygons
          style: {
            className:
              'openforms-leaflet-map-overlay-feature openforms-leaflet-map-overlay-feature--poly',
          },
        }).addTo(group);
      });
    };

    // Fetch new WFS overlay data after moving the map
    map.on('moveend', fetchData);
    fetchData();

    // Add LayerGroup to map
    group.addTo(map);

    return () => {
      map.off('moveend', fetchData);
      map.removeLayer(group);
    };
  }, [map, url, featureTypes]);

  return <LayerGroup ref={groupRef} />;
};

const WFSTileLayerControl: React.FC<TileLayerControlProps> = ({index, overlay}) => {
  return (
    <LeafletLayersControl.Overlay name={overlay.label} key={index} checked>
      <WFSTileLayer url={overlay.url} featureTypes={overlay.layers} />
    </LeafletLayersControl.Overlay>
  );
};

export const overlayTileLayerControls: Partial<
  Record<Overlay['type'], React.ElementType<TileLayerControlProps>>
> = {
  wms: WMSTileLayerControl,
  wfs: WFSTileLayerControl,
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
