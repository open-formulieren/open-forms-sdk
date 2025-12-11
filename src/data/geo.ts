import type {NearestLookupBody} from '@open-formulieren/formio-renderer/registry/map/types.js';
import type {
  SearchResult as LeafletSearchResult,
  ParseArgument,
  ProviderOptions,
} from 'leaflet-geosearch/src/providers/provider.js';
import AbstractProvider from 'leaflet-geosearch/src/providers/provider.js';

import {get} from '@/api';
import {logError} from '@/components/Errors';

/**
 * @see `#/components/schemas/GetStreetNameAndCityViewResult` in the API spec.
 */
export interface AutoCompleteResult {
  streetName: string;
  city: string;
  secretStreetCity: string;
}

export const autoCompleteAddress = async (
  baseUrl: string,
  postcode: string,
  houseNumber: string
): Promise<AutoCompleteResult | null> => {
  const params: Record<string, string> = {
    postcode: postcode,
    house_number: houseNumber,
  };
  try {
    const result = await get<AutoCompleteResult>(`${baseUrl}geo/address-autocomplete`, params);
    return result!;
  } catch (error) {
    logError(error);
    return null;
  }
};

export const getAddressLabel = async (
  baseUrl: string,
  lat: number,
  lng: number
): Promise<NearestLookupBody | null> => {
  let data: NearestLookupBody | null = null;

  try {
    const result = await get<{label: string}>(`${baseUrl}geo/latlng-search`, {
      lat: lat.toString(),
      lng: lng.toString(),
    });

    data = result ? {label: result.label} : null;
  } catch (error) {
    logError(error);
  }

  return data;
};

interface AddressSearchResult {
  label: string;
  // The address coordinates in WGS 84 coordinate system
  latLng: {
    lat: number;
    lng: number;
  };
  // The address coordinates in Rijksdriehoek coordinate system
  rd: {
    x: number;
    y: number;
  };
}

interface MapSearchResult {
  label: string;
  // The address coordinates in WGS 84 coordinate system
  x: number;
  y: number;
}

interface MapProviderParams extends ProviderOptions {
  baseUrl: string;
}

export class MapProvider extends AbstractProvider {
  private baseUrl: string;

  constructor(options: MapProviderParams) {
    super(options);
    this.baseUrl = `${options.baseUrl}geo/address-search`;
  }

  endpoint(): string {
    return this.baseUrl;
  }

  parse(response: ParseArgument<AddressSearchResult[]>): LeafletSearchResult<MapSearchResult>[] {
    return response.data.map(location => ({
      label: location.label,
      x: location.latLng.lng,
      y: location.latLng.lat,
      raw: {label: location.label, x: location.latLng.lng, y: location.latLng.lat},
      bounds: null,
    }));
  }

  async search({query}: {query: string}): Promise<LeafletSearchResult<MapSearchResult>[]> {
    let results: AddressSearchResult[] | null;
    try {
      results = await get<AddressSearchResult[]>(this.endpoint(), {q: query});
    } catch (error) {
      logError(error);
      return [];
    }
    if (!results) return [];
    return this.parse({data: results});
  }
}
