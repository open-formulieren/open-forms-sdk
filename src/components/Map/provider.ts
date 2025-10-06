import {get} from '@/api';

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

interface SearchResult {
  label: string;
  // The address coordinates in WGS 84 coordinate system
  x: number;
  y: number;
}

class OpenFormsProvider {
  private endpoint: string;

  constructor(baseUrl: string) {
    this.endpoint = `${baseUrl}geo/address-search`;
  }

  parse(results: AddressSearchResult[]): SearchResult[] {
    return results.map(location => ({
      label: location.label,
      x: location.latLng.lng,
      y: location.latLng.lat,
    }));
  }

  async search({query}: {query: string}): Promise<SearchResult[]> {
    let results;
    try {
      results = await get<AddressSearchResult[]>(this.endpoint, {q: query});
    } catch {
      // XXX: check if we can send this to Sentry
      return [];
    }
    if (!results) return [];
    return this.parse(results);
  }
}

export default OpenFormsProvider;
