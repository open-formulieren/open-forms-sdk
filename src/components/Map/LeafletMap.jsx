import * as Leaflet from 'leaflet';
import {GeoSearchControl} from 'leaflet-geosearch';
import PropTypes from 'prop-types';
import {useContext, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {FeatureGroup, MapContainer, TileLayer, useMap} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import {ConfigContext} from 'Context';
import {getBEMClassName} from 'utils';

import NearestAddress from './NearestAddress';
import {DEFAULT_INTERACTIONS, DEFAULT_LAT_LNG, DEFAULT_ZOOM} from './constants';
import {CRS_RD, TILE_LAYER_RD, initialize} from './init';
import OpenFormsProvider from './provider';
import {
  applyLeafletTranslations,
  leafletGestureHandlingText,
  locationControlMessages,
  searchControlMessages,
} from './translations';
import {GeoJsonGeometry} from './types';

// Run some Leaflet-specific patches...
initialize();

const getCoordinates = geoJsonGeometry => {
  if (!geoJsonGeometry) {
    return null;
  }

  const center = Leaflet.geoJSON(geoJsonGeometry).getBounds().getCenter();
  return [center.lat, center.lng];
};

const LeaftletMap = ({
  geoJsonGeometry,
  onGeoJsonGeometrySet,
  defaultCenter = DEFAULT_LAT_LNG,
  defaultZoomLevel = DEFAULT_ZOOM,
  disabled = false,
  interactions = DEFAULT_INTERACTIONS,
  tileLayerUrl = TILE_LAYER_RD.url,
}) => {
  const featureGroupRef = useRef();
  const intl = useIntl();
  const geoJsonCoordinates = getCoordinates(geoJsonGeometry);

  const modifiers = disabled ? ['disabled'] : [];
  const className = getBEMClassName('leaflet-map', modifiers);

  useEffect(() => {
    applyLeafletTranslations(intl);
  }, [intl]);

  const onFeatureCreate = event => {
    updateGeoJsonGeometry(event.layer);
  };

  const onFeatureDelete = () => {
    // The value `null` is needed to make sure that Formio actually updates the value.
    // node_modules/formiojs/components/_classes/component/Component.js:2528
    onGeoJsonGeometrySet?.(null);
  };

  const onSearchMarkerSet = event => {
    updateGeoJsonGeometry(event.marker);
  };

  const updateGeoJsonGeometry = newFeatureLayer => {
    // Remove all existing shapes from the map, ensuring that shapes are only added through
    // `geoJsonGeometry` changes.
    featureGroupRef.current?.clearLayers();
    onGeoJsonGeometrySet?.(newFeatureLayer.toGeoJSON().geometry);
  };

  return (
    <>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoomLevel}
        crs={CRS_RD}
        attributionControl
        className={className}
        searchControl
        gestureHandling
        gestureHandlingOptions={{
          text: {
            touch: intl.formatMessage(leafletGestureHandlingText.touch),
            scroll: intl.formatMessage(leafletGestureHandlingText.scroll),
            scrollMac: intl.formatMessage(leafletGestureHandlingText.scrollMac),
          },
          duration: 3000,
        }}
      >
        <EnsureTestId />
        <TileLayer {...TILE_LAYER_RD} url={tileLayerUrl} />
        <FeatureGroup ref={featureGroupRef}>
          {!disabled && (
            <EditControl
              position="topright"
              onCreated={onFeatureCreate}
              onDeleted={onFeatureDelete}
              edit={{
                edit: false,
              }}
              draw={{
                rectangle: false,
                circle: false,
                polyline: !!interactions?.polyline,
                polygon: !!interactions?.polygon,
                marker: !!interactions?.marker,
                circlemarker: false,
              }}
            />
          )}
          <Geometry geoJsonGeometry={geoJsonGeometry} featureGroupRef={featureGroupRef} />
        </FeatureGroup>
        {geoJsonCoordinates && <MapView coordinates={geoJsonCoordinates} />}
        {!disabled && (
          <SearchControl
            onMarkerSet={onSearchMarkerSet}
            options={{
              showMarker: false,
              showPopup: false,
              retainZoomLevel: false,
              animateZoom: true,
              autoClose: false,
              searchLabel: intl.formatMessage(searchControlMessages.searchLabel),
              keepResult: true,
              updateMap: true,
              notFoundMessage: intl.formatMessage(searchControlMessages.notFound),
            }}
          />
        )}
        <LocationControl />
        {disabled && <DisabledMapControls />}
      </MapContainer>
      {geoJsonCoordinates && geoJsonCoordinates.length && (
        <NearestAddress coordinates={geoJsonCoordinates} />
      )}
    </>
  );
};

LeaftletMap.propTypes = {
  geoJsonGeometry: GeoJsonGeometry,
  onGeoJsonGeometrySet: PropTypes.func,
  interactions: PropTypes.shape({
    polyline: PropTypes.bool,
    polygon: PropTypes.bool,
    marker: PropTypes.bool,
  }),
  disabled: PropTypes.bool,
  tileLayerUrl: PropTypes.string,
};

const EnsureTestId = () => {
  const map = useMap();
  const container = map.getContainer();
  useEffect(() => {
    if (!container.dataset.testid) {
      container.dataset.testid = 'leaflet-map';
    }
  }, [container]);
  return null;
};

const Geometry = ({geoJsonGeometry, featureGroupRef}) => {
  useEffect(() => {
    if (!featureGroupRef.current) {
      // If there is no feature group, nothing should be done...
      return;
    }

    // Remove all shapes from the map.
    // Only the data from `geoJsonGeometry` should be shown on the map.
    featureGroupRef.current.clearLayers();
    if (!geoJsonGeometry) {
      return;
    }

    // Add the `geoJsonGeometry` data as shape.
    const layer = Leaflet.GeoJSON.geometryToLayer(geoJsonGeometry);
    featureGroupRef.current.addLayer(layer);
  }, [featureGroupRef, geoJsonGeometry]);

  return null;
};

Geometry.propTypes = {
  geoJsonGeometry: GeoJsonGeometry,
  featureGroupRef: PropTypes.object.isRequired,
};

// Set the map view if coordinates are provided
const setMapView = (map, coordinates = null) => {
  if (!coordinates || coordinates.length !== 2) return;
  if (!coordinates.filter(value => isFinite(value)).length === 2) return;
  map.setView(coordinates);
};

// Set the map view if coordinates are provided
// @TODO can be removed/relocated to main functionality?
const MapView = ({coordinates = null}) => {
  const map = useMap();
  useEffect(() => {
    setMapView(map, coordinates);
  }, [map, coordinates]);
  // rendering is done by leaflet, so just return null
  return null;
};

MapView.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number),
};

/**
 * Custom Leaflet location control, for "use current user location" functionality.
 *
 * @class
 * @constructor
 */
const LocationButton = Leaflet.Control.extend({
  /**
   * Create a location button.
   *
   * @param disabledButton boolean
   * @param onClick fn - a function that doesn't accept arguments
   * @param tooltip string
   * @param ariaLabel string
   */
  initialize: function (disabledButton, onClick, tooltip, ariaLabel) {
    this.disabledButton = disabledButton;
    this.onClick = onClick;
    this.tooltip = tooltip;
    this.ariaLabel = ariaLabel;
  },
  /**
   * Global configuration for the control.
   */
  options: {
    position: 'topleft',
  },
  /**
   * Define the html and functionality of the control button.
   *
   * @returns {HTMLDivElement}
   */
  onAdd: function () {
    const container = Leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const button = Leaflet.DomUtil.create(
      'a',
      `leaflet-control-button fa-solid fa-location-crosshairs ${this.disabledButton && 'leaflet-disabled'}`,
      container
    );

    Leaflet.DomEvent.disableClickPropagation(button);
    Leaflet.DomEvent.on(button, 'click', () => {
      if (!this.disabledButton) {
        this.onClick();
      }
    });

    button.title = this.tooltip;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-disabled', this.disabledButton);
    button.setAttribute('aria-label', this.ariaLabel);

    return container;
  },
});

const LocationControl = () => {
  const map = useMap();
  const intl = useIntl();

  const [disabled, setDisabled] = useState(false);

  // Create location control button and attach it to the map
  useEffect(() => {
    /**
     * @param position GeolocationPosition
     */
    const onGeoLocationSuccess = position => {
      setMapView(map, [position.coords.latitude, position.coords.longitude]);
    };

    /**
     * @param positionError GeolocationPositionError
     */
    const onGeoLocationError = positionError => {
      // Only update the state if `disabled` is `false`, preventing unnecessary renders.
      if (positionError.code === GeolocationPositionError.PERMISSION_DENIED && !disabled) {
        setDisabled(true);
      }
    };

    const locationButton = new LocationButton(
      disabled,
      () => {
        navigator.geolocation.getCurrentPosition(onGeoLocationSuccess, onGeoLocationError);
      },
      intl.formatMessage(
        !disabled
          ? locationControlMessages.buttonTitle
          : locationControlMessages.buttonTitleDisabled
      ),
      intl.formatMessage(
        !disabled
          ? locationControlMessages.buttonLabel
          : locationControlMessages.buttonLabelDisabled
      )
    );
    map.addControl(locationButton);

    return () => {
      map.removeControl(locationButton);
    };
  }, [disabled, intl, map]);

  return null;
};

const SearchControl = ({onMarkerSet, options}) => {
  const {baseUrl} = useContext(ConfigContext);
  const map = useMap();
  const intl = useIntl();

  const {
    showMarker,
    showPopup,
    retainZoomLevel,
    animateZoom,
    autoClose,
    searchLabel,
    keepResult,
    updateMap,
    notFoundMessage,
  } = options;

  const buttonLabel = intl.formatMessage(searchControlMessages.buttonLabel);

  useEffect(() => {
    const provider = new OpenFormsProvider(baseUrl);
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'button',
      showMarker,
      showPopup,
      retainZoomLevel,
      animateZoom,
      autoClose,
      searchLabel,
      keepResult,
      updateMap,
      notFoundMessage,
    });

    searchControl.button.setAttribute('aria-label', buttonLabel);
    map.addControl(searchControl);
    map.on('geosearch/showlocation', onMarkerSet);

    return () => {
      map.off('geosearch/showlocation', onMarkerSet);
      map.removeControl(searchControl);
    };
  }, [
    map,
    onMarkerSet,
    baseUrl,
    showMarker,
    showPopup,
    retainZoomLevel,
    animateZoom,
    autoClose,
    searchLabel,
    keepResult,
    updateMap,
    notFoundMessage,
    buttonLabel,
  ]);

  return null;
};

SearchControl.propTypes = {
  onMarkerSet: PropTypes.func.isRequired,
  options: PropTypes.shape({
    showMarker: PropTypes.bool.isRequired,
    showPopup: PropTypes.bool.isRequired,
    retainZoomLevel: PropTypes.bool.isRequired,
    animateZoom: PropTypes.bool.isRequired,
    autoClose: PropTypes.bool.isRequired,
    searchLabel: PropTypes.string.isRequired,
    keepResult: PropTypes.bool.isRequired,
    updateMap: PropTypes.bool.isRequired,
    notFoundMessage: PropTypes.string.isRequired,
  }),
};

const DisabledMapControls = () => {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }, [map]);
  return null;
};

export default LeaftletMap;
