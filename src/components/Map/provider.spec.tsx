import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';

import {
  mockAddressSearch400Get,
  mockAddressSearch403Get,
  mockAddressSearchGet,
  mockAddressSearchNoResultsGet,
} from './mocks';
import OpenFormsProvider from './provider';

describe('The OpenForms Geo search provider', () => {
  it('parses search results with coordinates', async () => {
    mswServer.use(mockAddressSearchGet);
    const provider = new OpenFormsProvider(BASE_URL);

    const results = await provider.search({query: 'Utrecht'});

    expect(results).toEqual([
      {
        label: 'Gemeente Utrecht',
        x: 5.0747543,
        y: 52.09113798,
      },
      {
        label: 'Utrecht, Utrecht, Utrecht',
        x: 5.09520363,
        y: 52.0886922,
      },
      {
        label: 'Haarzuilens, Utrecht, Utrecht',
        x: 4.99217483,
        y: 52.12464618,
      },
      {
        label: 'Vleuten, Utrecht, Utrecht',
        x: 5.00828849,
        y: 52.10196571,
      },
      {
        label: 'De Meern, Utrecht, Utrecht',
        x: 5.02740209,
        y: 52.0776684,
      },
      {
        label: 'Achterveld, Leusden, Utrecht',
        x: 5.47878997,
        y: 52.14069768,
      },
      {
        label: 'Ameide, Vijfheerenlanden, Utrecht',
        x: 4.9651235,
        y: 51.94766346,
      },
      {
        label: 'Amersfoort, Amersfoort, Utrecht',
        x: 5.38941304,
        y: 52.16815655,
      },
      {
        label: 'Austerlitz, Zeist, Utrecht',
        x: 5.31241379,
        y: 52.08379117,
      },
      {
        label: 'Baarn, Baarn, Utrecht',
        x: 5.27134105,
        y: 52.20712881,
      },
    ]);
  });

  it('can handle empty result lists', async () => {
    mswServer.use(mockAddressSearchNoResultsGet);
    const provider = new OpenFormsProvider(BASE_URL);

    const results = await provider.search({query: 'Utrecht'});

    expect(results).toEqual([]);
  });

  it('handles empty search query validation errors', async () => {
    mswServer.use(mockAddressSearch400Get);
    const provider = new OpenFormsProvider(BASE_URL);

    const results = await provider.search({query: ''});

    expect(results).toEqual([]);
  });

  it('handles invalid permission errors', async () => {
    mswServer.use(mockAddressSearch403Get);
    const provider = new OpenFormsProvider(BASE_URL);

    const results = await provider.search({query: 'Utrecht'});

    expect(results).toEqual([]);
  });
});
