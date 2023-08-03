import {addDays, formatISO} from 'date-fns';
import isEqual from 'lodash/isEqual';
import {rest} from 'msw';

import {BASE_URL} from 'api-mocks';

const DEFAULT_PRODUCTS = [
  {code: 'PASAAN', identifier: '166a5c79', name: 'Paspoort aanvraag'},
  {code: 'RIJAAN', identifier: 'e8e045ab', name: 'Rijbewijs aanvraag (Drivers license)'},
  {code: 'LIMITED', identifier: 'ea04db83', name: 'Not available with drivers license'},
];

const LOCATIONS = [
  {
    products: ['166a5c79', 'e8e045ab'],
    location: {identifier: '1396f17c', name: 'Open Gem'},
  },
  {
    products: ['e8e045ab', 'ea04db83'],
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

const isSameIds = (arr1, arr2) => {
  const [copy1, copy2] = [[...arr1].sort(), [...arr2].sort()];
  return isEqual(copy1, copy2);
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

export const mockAppointmentProductsGet = rest.get(
  `${BASE_URL}appointments/products`,
  (req, res, ctx) => {
    let availableProductIds = [];
    const selectedProductIds = req.url.searchParams.getAll('product_id').sort();
    // when other products are already selected, the set of available products to select
    // shrinks. This configuration prevents selecting product ea04db83 when product
    // e8e045ab is selected
    switch (selectedProductIds.join(',')) {
      // no other products selected -> everything is available
      case '': {
        availableProductIds = DEFAULT_PRODUCTS.map(p => p.identifier);
        break;
      }
      // passport -> allow both driver's license and "not available with driver's license"
      case '166a5c79': {
        availableProductIds = ['e8e045ab', 'ea04db83'];
        break;
      }
      // driver's license -> allow only passport
      case 'e8e045ab': {
        availableProductIds = ['166a5c79'];
        break;
      }
      // "not available with driver's license" -> allow no other products
      case 'ea04db83': {
        availableProductIds = [];
        break;
      }
      // passport + driver's license -> exclude "not available with driver's license"
      case '166a5c79,e8e045ab': {
        availableProductIds = [];
        break;
      }
      // passport + "not available with driver's license" -> allow no driver's license
      case '166a5c79,ea04db83': {
        availableProductIds = [];
        break;
      }
      default:
        throw new Error('Invalid querystring combination used.');
    }

    const products = DEFAULT_PRODUCTS.filter(p => availableProductIds.includes(p.identifier));
    return res(ctx.json(products));
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
    // ensure we can handle datetimes with timezone information in varying formats.
    // Ideally, the API returns UTC, but the UI needs to display localized times.
    const times = [
      `${date}T08:00:00Z`,
      `${date}T08:30:00Z`,
      `${date}T06:00:00Z`,
      `${date}T06:10:00Z`,
      `${date}T14:30:00+02:00`,
    ].map(datetime => ({time: datetime}));
    return res(ctx.json(times));
  }
);

export const mockAppointmentCustomerFieldsGet = rest.get(
  `${BASE_URL}appointments/customer-fields`,
  (req, res, ctx) => {
    // all possible field types from the backend
    const fields = [
      {
        type: 'textfield',
        key: 'lastName',
        label: 'Last name',
        autocomplete: 'family-name',
        validate: {
          required: true,
          maxLength: 128,
        },
      },
      {
        type: 'date',
        key: 'dateOfBirth',
        label: 'Birthday',
        autocomplete: 'bday',
        validate: {
          required: true,
        },
        openForms: {
          widget: 'inputGroup',
        },
      },
      {
        type: 'email',
        key: 'email',
        label: 'Email',
        autocomplete: 'email',
        validate: {
          required: true,
          maxLength: 254,
        },
      },
      {
        type: 'phoneNumber',
        key: 'phone',
        label: 'Telephone',
        autocomplete: 'tel',
        validate: {
          required: true,
          maxLength: 16,
        },
      },
      {
        type: 'bsn',
        key: 'bsn',
        label: 'BSN',
        validate: {
          required: true,
          maxLength: 16,
        },
      },
      {
        type: 'radio',
        key: 'gender',
        label: 'Gender',
        validate: {
          required: true,
        },
        values: [
          {value: 'X', label: "Don't want to say"},
          {value: 'M', label: 'Male'},
          {value: 'F', label: 'Female'},
        ],
      },
    ];
    return res(ctx.json(fields));
  }
);

export const mockAppointmentPost = rest.post(
  `${BASE_URL}appointments/appointments`,
  async (req, res, ctx) => {
    const {
      submission: submissionUrl,
      products,
      location,
      date,
      datetime,
      contactDetails,
    } = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        submission: submissionUrl,
        products,
        location,
        date,
        datetime,
        contactDetails,
        statusUrl: `${submissionUrl}/-token-/status`,
      })
    );
  }
);

export const mockAppointmentErrorPost = rest.post(
  `${BASE_URL}appointments/appointments`,
  async (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Invalid input.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams: [
          {
            name: 'contactDetails.dateOfBirth',
            code: 'invalid',
            reason: 'You cannot be born in the future.',
          },
        ],
      })
    );
  }
);

export const mockAppointmentCancelPost = rest.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  (req, res, ctx) => res(ctx.status(204))
);

export const mockAppointmentCancelErrorPost = rest.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  (req, res, ctx) =>
    res(
      ctx.status(400),
      ctx.json({
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Invalid input.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams: [
          {
            name: 'email',
            code: 'invalid',
            reason: 'Invalid e-mail for the submission.',
          },
        ],
      })
    )
);
