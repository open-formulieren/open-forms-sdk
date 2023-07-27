import {apiCall} from 'api';

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
    let response;
    const searchParams = new URLSearchParams({q: query});
    const url = this.endpoint + `?${searchParams}`;

    try {
      response = await apiCall(url);
    } catch (e) {
      return [];
    }

    if (response.status != 200) return [];

    const searchResponse = await response.json();

    if (!searchResponse) return [];

    return this.parse(searchResponse);
  }
}

export default OpenFormsProvider;
