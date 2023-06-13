import {addDays, formatISO} from 'date-fns';
import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

const DEFAULT_PRODUCTS = [
  {code: 'PASAAN', identifier: '166a5c79', name: 'Paspoort aanvraag'},
  {code: 'RIJAAN', identifier: 'e8e045ab', name: 'Rijbewijs aanvraag (Drivers license)'},
];

const LOCATIONS = [
  {
    products: ['166a5c79', 'e8e045ab'],
    location: {identifier: '1396f17c', name: 'Open Gem'},
  },
  {
    products: ['e8e045ab'],
    location: {identifier: '34000e85', name: 'Bahamas'},
  },
];

const _getDate = (numDaysToAdd = 0) => {
  return () => {
    const now = new Date();
    const newDate = numDaysToAdd ? addDays(now, numDaysToAdd) : now;
    return formatISO(newDate, {representation: 'date'});
  };
};

const DATES = [
  {
    location: '1396f17c',
    // tomorrow and the next 4 days
    dates: [_getDate(1), _getDate(2), _getDate(3), _getDate(4), _getDate(5)],
  },
  {
    location: '34000e85',
    // today, 2 days not and then the next 3 days
    dates: [_getDate(), _getDate(3), _getDate(4), _getDate(5)],
  },
];

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
  `${BASE_URL}appointments/locations`,
  (req, res, ctx) => {
    const productIds = req.url.searchParams.getAll('product_id');
    const locations = LOCATIONS.filter(config =>
      productIds.every(productId => config.products.includes(productId))
    ).map(config => config.location);
    return res(ctx.json(locations));
  }
);

export const mockAppointmentDatesGet = rest.get(
  `${BASE_URL}appointments/dates`,
  (req, res, ctx) => {
    const locationId = req.url.searchParams.get('location_id');
    let result = [];
    switch (locationId) {
      case 'no-date': {
        result = [];
        break;
      }
      case 'single-date': {
        result = [{date: _getDate(1)()}];
        break;
      }
      default: {
        const {dates} = DATES.find(d => d.location === locationId);
        result = dates.map(d => ({date: d()}));
      }
    }
    return res(ctx.json(result));
  }
);

export const mockAppointmentTimesGet = rest.get(
  `${BASE_URL}appointments/times`,
  (req, res, ctx) => {
    const date = req.url.searchParams.get('date');
    const times = DEFAULT_TIMES.filter(
      t => new Date(t.time).toDateString() === new Date(date).toDateString()
    );
    return res(ctx.json(times));
  }
);
