import {get} from 'api';

class OpenFormsProvider {
  constructor(baseUrl) {
    this.endpoint = `${baseUrl}geo/address-search`;
  }

  parse(results) {
    return results.map(location => ({
      label: location.label,
      x: location.latLng.lng,
      y: location.latLng.lat,
    }));
  }

  async search({query}) {
    let results;
    try {
      results = await get(this.endpoint, {q: query});
    } catch {
      // XXX: check if we can send this to Sentry
      return [];
    }
    if (!results) return [];
    return this.parse(results);
  }
}

export default OpenFormsProvider;
