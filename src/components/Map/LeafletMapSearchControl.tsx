import type {Control, LeafletEvent, Marker} from 'leaflet';
import {GeoSearchControl} from 'leaflet-geosearch';
import {useContext, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useMap} from 'react-leaflet';

import {ConfigContext} from 'Context';

import './LeafletMapSearchControl.scss';
import OpenFormsProvider from './provider';
import {searchControlMessages} from './translations';

type SearchControlOptions = {
  showMarker: boolean;
  showPopup: boolean;
  retainZoomLevel: boolean;
  animateZoom: boolean;
  autoClose: boolean;
  searchLabel: string;
  keepResult: boolean;
  updateMap: boolean;
  notFoundMessage: string;
};

export type GeoSearchShowLocationEvent = LeafletEvent & {
  location: {
    label: string;
    x: number;
    y: number;
  };
  marker: Marker;
};

interface SearchControlProps {
  onMarkerSet: (event: GeoSearchShowLocationEvent) => void;
  options: SearchControlOptions;
}

interface GeoSearchControlConstructor {
  new (value?: SearchControlOptions & {provider: OpenFormsProvider; style: string}): Control;
  (): Control;
  (value: SearchControlOptions & {provider: OpenFormsProvider; style: string}): Control;
}

const SearchControl: React.FC<SearchControlProps> = ({onMarkerSet, options}) => {
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
    // Leaflet-geosearch isn't very typescript friendly...
    const searchControl = new (GeoSearchControl as unknown as GeoSearchControlConstructor)({
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

    if ('button' in searchControl) {
      (searchControl.button as HTMLButtonElement).setAttribute('aria-label', buttonLabel);
    }
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

export default SearchControl;
