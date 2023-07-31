import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

const SEARCH_ENDPOINT = `${BASE_URL}geo/address-search`;

export const mockAddressSearchGet = rest.get(SEARCH_ENDPOINT, (req, res, ctx) => {
  const response = [
    {
      label: 'Gemeente Utrecht',
      latLng: {
        lat: 52.09113798,
        lng: 5.0747543,
      },
      rd: {
        x: 133587.182,
        y: 455921.594,
      },
    },
    {
      label: 'Utrecht, Utrecht, Utrecht',
      latLng: {
        lat: 52.0886922,
        lng: 5.09520363,
      },
      rd: {
        x: 134987.52,
        y: 455643.648,
      },
    },
    {
      label: 'Haarzuilens, Utrecht, Utrecht',
      latLng: {
        lat: 52.12464618,
        lng: 4.99217483,
      },
      rd: {
        x: 127948.146,
        y: 459677.227,
      },
    },
    {
      label: 'Vleuten, Utrecht, Utrecht',
      latLng: {
        lat: 52.10196571,
        lng: 5.00828849,
      },
      rd: {
        x: 129038.446,
        y: 457147.95,
      },
    },
    {
      label: 'De Meern, Utrecht, Utrecht',
      latLng: {
        lat: 52.0776684,
        lng: 5.02740209,
      },
      rd: {
        x: 130334.623,
        y: 454438.014,
      },
    },
    {
      label: 'Achterveld, Leusden, Utrecht',
      latLng: {
        lat: 52.14069768,
        lng: 5.47878997,
      },
      rd: {
        x: 161269.68,
        y: 461393.521,
      },
    },
    {
      label: 'Ameide, Vijfheerenlanden, Utrecht',
      latLng: {
        lat: 51.94766346,
        lng: 4.9651235,
      },
      rd: {
        x: 125981.253,
        y: 439997.097,
      },
    },
    {
      label: 'Amersfoort, Amersfoort, Utrecht',
      latLng: {
        lat: 52.16815655,
        lng: 5.38941304,
      },
      rd: {
        x: 155151.16,
        y: 464444.637,
      },
    },
    {
      label: 'Austerlitz, Zeist, Utrecht',
      latLng: {
        lat: 52.08379117,
        lng: 5.31241379,
      },
      rd: {
        x: 149873.661,
        y: 455060.786,
      },
    },
    {
      label: 'Baarn, Baarn, Utrecht',
      latLng: {
        lat: 52.20712881,
        lng: 5.27134105,
      },
      rd: {
        x: 147080.269,
        y: 468787.033,
      },
    },
  ];
  return res(ctx.status(200), ctx.json(response));
});

export const mockAddressSearchNoResultsGet = rest.get(SEARCH_ENDPOINT, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json([]));
});

export const mockAddressSearch400Get = rest.get(SEARCH_ENDPOINT, (req, res, ctx) => {
  return res(
    ctx.status(400),
    ctx.json({
      type: `${BASE_URL}/fouten/ValidationError/`,
      code: 'invalid',
      title: 'Invalid input.',
      status: 400,
      detail: '',
      instance: 'urn:uuid:fe568833-f520-4fc9-8f54-37648f2b46b8',
      invalidParams: [
        {
          name: 'invalidParams',
          code: 'invalid',
          reason: "Missing query parameter 'q'",
        },
      ],
    })
  );
});

export const mockAddressSearch403Get = rest.get(SEARCH_ENDPOINT, (req, res, ctx) => {
  return res(
    ctx.status(403),
    ctx.json({
      type: `${BASE_URL}/fouten/PermissionDenied/`,
      code: 'permission_denied',
      title: 'Je hebt geen toestemming om deze actie uit te voeren.',
      status: 403,
      detail: 'Je hebt geen toestemming om deze actie uit te voeren.',
      instance: 'urn:uuid:fe568833-f520-4fc9-8f54-37648f2b46b8',
    })
  );
});
