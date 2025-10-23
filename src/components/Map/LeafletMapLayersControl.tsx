import type {MapComponentSchema} from '@open-formulieren/types';
import type {Feature} from 'geojson';
import * as Leaflet from 'leaflet';
import {useCallback, useEffect, useRef} from 'react';
import ReactDOMServer from 'react-dom/server';
import {useIntl} from 'react-intl';
import {
  LayerGroup,
  LayersControl as LeafletLayersControl,
  WMSTileLayer,
  useMap,
} from 'react-leaflet';

import './LeafletMapLayersControl.scss';
import {fetchFeatureCollections, getTileKey, getTilesFromBounds} from './fetchWFSFeatures';
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
  const intl = useIntl();
  const groupRef = useRef<Leaflet.LayerGroup>(null);
  const tileCacheRef = useRef<Set<string>>(new Set());

  const getPopupContent = useCallback(
    (feature: Feature): string => {
      const popupContent = (
        <table
          className="openforms-leaflet-map-overlay-popup-table"
          title={intl.formatMessage({
            description: 'Leaflet WFS overlay feature popup menu title',
            defaultMessage: 'WFS feature properties',
          })}
        >
          {Object.entries(feature?.properties || {}).map(([key, value]) => (
            <tr key={key}>
              <th className="openforms-leaflet-map-overlay-popup-table__item-key">{key}</th>
              <td className="openforms-leaflet-map-overlay-popup-table__item-value">
                {value || '-'}
              </td>
            </tr>
          ))}
        </table>
      );
      return ReactDOMServer.renderToString(popupContent);
    },
    [intl]
  );

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const tileCache = tileCacheRef.current;

    const updateFeatureCollections = async () => {
      // Only update features when layer is active.
      if (!map.hasLayer(group)) {
        return;
      }

      const bounds = map.getBounds();
      const zoom = map.getZoom();
      // Create tiles from the map bounds, and determine which tiles to fetch
      const visibleTiles = getTilesFromBounds(bounds, map);
      const tilesToFetch = visibleTiles.filter(tile => !tileCache.has(getTileKey(tile, zoom)));

      // Add all newly fetched tiles to the cache
      tilesToFetch.forEach(tile => tileCache.add(getTileKey(tile, zoom)));
      const featureCollections = await fetchFeatureCollections(
        url,
        featureTypes,
        tilesToFetch,
        map
      );

      // Mount the new WFS shapes
      featureCollections.forEach(featureCollection => {
        // We have to use the base Leaflet functions, because the React version of
        // Leaflet gets very confused when we try to update the WFS data.
        Leaflet.geoJSON(featureCollection, {
          pointToLayer: (_, latlng) =>
            Leaflet.marker(latlng, {
              icon: Leaflet.divIcon({
                className:
                  'openforms-leaflet-map-overlay-feature openforms-leaflet-map-overlay-feature--marker',
              }),
              title: intl.formatMessage({
                description: 'Leaflet WFS overlay marker title',
                defaultMessage: 'Interactive marker',
              }),
            }),
          style: {
            className:
              'openforms-leaflet-map-overlay-feature openforms-leaflet-map-overlay-feature--poly',
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(getPopupContent(feature), {maxHeight: 200});
          },
        }).addTo(group);
      });
    };

    // When zoom level changes, clear the cache and update the features.
    const handleZoom = () => {
      tileCache.clear();
      group.clearLayers();
      updateFeatureCollections();
    };

    // Fetch new WFS overlay data after moving the map
    map.on('moveend', updateFeatureCollections);
    map.on('zoomend', handleZoom);
    updateFeatureCollections();

    // Add LayerGroup to map
    group.addTo(map);

    return () => {
      map.off('moveend', updateFeatureCollections);
      map.off('zoomend', handleZoom);
      map.removeLayer(group);
    };
  }, [map, url, featureTypes, intl, getPopupContent]);

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
