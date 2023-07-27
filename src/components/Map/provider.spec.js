import {waitFor} from '@testing-library/react';

import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';

import {
  mockPdokApi400ResponseGet,
  mockPdokApi403ResponseGet,
  mockPdokApiEmptyResponseGet,
  mockPdokApiResponseGet,
} from './mocks';
import OpenFormsProvider from './provider';

describe('Openforms Provider', () => {
  it('Provider receives coordiantes', async () => {
    mswServer.use(mockPdokApiResponseGet);

    const provider = new OpenFormsProvider(BASE_URL);
    const results = await provider.search({query: 'Utrecht'});

    await waitFor(() => {
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
  });

  it('Provider receives empty list', async () => {
    mswServer.use(mockPdokApiEmptyResponseGet);

    const provider = new OpenFormsProvider(BASE_URL);
    const results = await provider.search({query: 'Utrecht'});

    await waitFor(() => {
      expect(results).toEqual([]);
    });
  });

  it('Provider receives status code 400', async () => {
    mswServer.use(mockPdokApi400ResponseGet);

    const provider = new OpenFormsProvider(BASE_URL);
    const results = await provider.search({query: 'Utrecht'});

    await waitFor(() => {
      expect(results).toEqual([]);
    });
  });

  it('Provider receives status code 403', async () => {
    mswServer.use(mockPdokApi403ResponseGet);

    const provider = new OpenFormsProvider(BASE_URL);
    const results = await provider.search({query: 'Utrecht'});

    await waitFor(() => {
      expect(results).toEqual([]);
    });
  });
});
