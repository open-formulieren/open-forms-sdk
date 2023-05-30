import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

const DEFAULT_PRODUCTS = [
  {code: 'PASAAN', identifier: '166a5c79', name: 'Paspoort aanvraag'},
  {code: 'RIJAAN', identifier: 'e8e045ab', name: 'Rijbewijs aanvraag (Drivers license)'},
];

const DEFAULT_LOCATIONS = [{identifier: '1', name: 'Maykin Media'}];

const DEFAULT_DATES = [{date: '2021-08-19'}, {date: '2021-08-20'}];

const DEFAULT_TIMES = [
  {time: '2021-08-19T10:00:00+02:00'},
  {time: '2021-08-19T10:30:00+02:00'},
  {time: '2021-08-20T08:00:00+02:00'},
  {time: '2021-08-20T08:10:00+02:00'},
];

export const mockAppointmentProductsGet = rest.get(
  `${BASE_URL}appointments/products`,
  (req, res, ctx) => {
    return res(ctx.json(DEFAULT_PRODUCTS));
  }
);

export const mockAppointmentLocationsGet = rest.get(
  `${BASE_URL}appointments/locations?product_id=:product_id`,
  (req, res, ctx) => {
    return res(ctx.json(DEFAULT_LOCATIONS));
  }
);

export const mockAppointmentDatesGet = rest.get(
  `${BASE_URL}appointments/dates?product_id=:product_id&location_id=:location_id`,
  (req, res, ctx) => {
    return res(ctx.json(DEFAULT_DATES));
  }
);

export const mockAppointmentTimesGet = rest.get(
  `${BASE_URL}appointments/times?product_id=:product_id&location_id=:location_id&date=:date`,
  (req, res, ctx) => {
    const date = req.url.searchParams.get('date');
    const times = DEFAULT_TIMES.filter(
      t => new Date(t.time).toDateString() === new Date(date).toDateString()
    );
    return res(ctx.json(times));
  }
);
