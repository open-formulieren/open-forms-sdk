import type {AnyComponentSchema} from '@open-formulieren/types';
import {addDays, formatISO, isValid, parseISO} from 'date-fns';
import {HttpResponse, http} from 'msw';
import type {PathParams} from 'msw';

import type {Appointment, AppointmentCreateBody, Location, Product} from '@/data/appointments';
import type {InvalidParam} from '@/errors';

import {BASE_URL} from './base';

const DEFAULT_PRODUCTS: Product[] = [
  {code: 'PASAAN', identifier: '166a5c79', name: 'Paspoort aanvraag'},
  {code: 'RIJAAN', identifier: 'e8e045ab', name: 'Rijbewijs aanvraag (Drivers license)'},
  {code: 'LIMITED', identifier: 'ea04db83', name: 'Not available with drivers license'},
];

export const mockAppointmentProductsGet = http.get(
  `${BASE_URL}appointments/products`,
  ({request}) => {
    let availableProductIds: string[] = [];
    const url = new URL(request.url);
    const selectedProductIds = url.searchParams.getAll('product_id').sort();
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
    return HttpResponse.json<Product[]>(products);
  }
);

interface LocationConfig {
  products: string[];
  location: Location;
}

const LOCATIONS: LocationConfig[] = [
  {
    products: ['166a5c79', 'e8e045ab'],
    location: {
      identifier: '1396f17c',
      name: 'Open Gem',
      city: 'Amsterdam',
      address: '',
      postalcode: '',
    },
  },
  {
    products: ['e8e045ab', 'ea04db83'],
    location: {
      identifier: '34000e85',
      name: 'Bahamas',
      city: 'Nassau',
      address: 'Winsome Dr',
      postalcode: '1014 EG',
    },
  },
];

export const mockAppointmentLocationsGet = http.get(
  `${BASE_URL}appointments/locations`,
  ({request}) => {
    const url = new URL(request.url);
    const productIds = url.searchParams.getAll('product_id');
    const locations = LOCATIONS.filter(config =>
      productIds.every(productId => config.products.includes(productId))
    ).map(config => config.location);
    return HttpResponse.json<Location[]>(locations);
  }
);

type GetDateCallback = () => string;

const _getDate = (numDaysToAdd: number = 0): GetDateCallback => {
  return () => {
    const now = new Date();
    const newDate = numDaysToAdd ? addDays(now, numDaysToAdd) : now;
    return formatISO(newDate, {representation: 'date'});
  };
};

interface DateConfig {
  location: string;
  dates: GetDateCallback[];
}

const DATES: DateConfig[] = [
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

export const mockAppointmentDatesGet = http.get(`${BASE_URL}appointments/dates`, ({request}) => {
  const url = new URL(request.url);
  const locationId = url.searchParams.get('location_id');
  let result: {date: string}[] = [];
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
      const match = DATES.find(d => d.location === locationId);
      if (!match) throw new Error(`No match found for location ${locationId}`);
      const {dates} = match;
      result = dates.map(d => ({date: d()}));
    }
  }
  return HttpResponse.json<{date: string}[]>(result);
});

export const mockAppointmentTimesGet = http.get(`${BASE_URL}appointments/times`, ({request}) => {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || '';
  // the backend validates the `date` parameter
  if (!isValid(parseISO(date))) {
    return HttpResponse.json(
      {
        type: 'http://localhost:8000/fouten/ValidationError/',
        code: 'invalid',
        title: 'Invalid input.',
        status: 400,
        detail: '',
        instance: 'urn:uuid:41e0174a-efc2-4cc0-9bf2-8366242a4e75',
        invalidParams: [
          {
            name: 'date',
            code: 'invalid',
            reason: 'Invalid ISO-8601 date.',
          },
        ],
      },
      {status: 400}
    );
  }

  // ensure we can handle datetimes with timezone information in varying formats.
  // Ideally, the API returns UTC, but the UI needs to display localized times.
  const times = [
    `${date}T08:00:00Z`,
    `${date}T08:30:00Z`,
    `${date}T06:00:00Z`,
    `${date}T06:10:00Z`,
    `${date}T14:30:00+02:00`,
  ].map(datetime => ({time: datetime}));
  return HttpResponse.json<{time: string}[]>(times);
});

export const mockAppointmentCustomerFieldsGet = http.get(
  `${BASE_URL}appointments/customer-fields`,
  () => {
    // all possible field types from the backend
    const fields: AnyComponentSchema[] = [
      {
        id: 'lastName',
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
        id: 'dateOfBirth',
        type: 'date',
        key: 'dateOfBirth',
        label: 'Birthday',
        // @ts-expect-error FIXME: support autocomplete on date components
        autocomplete: 'bday',
        validate: {
          required: true,
        },
        openForms: {
          widget: 'inputGroup',
          translations: {},
        },
      },
      {
        id: 'email',
        type: 'email',
        key: 'email',
        label: 'Email',
        autocomplete: 'email',
        validate: {
          required: true,
          // @ts-expect-error FIXME: support autocomplete on email components
          maxLength: 254,
        },
      },
      {
        id: 'phone',
        type: 'phoneNumber',
        key: 'phone',
        label: 'Telephone',
        autocomplete: 'tel',
        validate: {
          required: true,
          // @ts-expect-error FIXME: support autocomplete on phone number components
          maxLength: 16,
        },
      },
      {
        id: 'bsn',
        type: 'bsn',
        key: 'bsn',
        label: 'BSN',
        validate: {
          required: true,
        },
      },
      {
        id: 'gender',
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
        defaultValue: null,
        openForms: {
          translations: {},
          dataSrc: 'manual',
        },
      },
    ];
    return HttpResponse.json<AnyComponentSchema[]>(fields);
  }
);

export const mockAppointmentPost = http.post<PathParams, AppointmentCreateBody, Appointment>(
  `${BASE_URL}appointments/appointments`,
  async ({request}) => {
    const {
      submission: submissionUrl,
      products,
      location,
      date,
      datetime,
      contactDetails,
    } = await request.json();
    return HttpResponse.json(
      {
        submission: submissionUrl,
        products,
        location,
        date,
        datetime,
        contactDetails,
        statusUrl: `${submissionUrl}/-token-/status`,
      },
      {status: 201}
    );
  }
);

export const mockAppointmentErrorPost = http.post(`${BASE_URL}appointments/appointments`, () => {
  return HttpResponse.json(
    {
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
      ] satisfies InvalidParam[],
    },
    {status: 400}
  );
});

/**
 * Mock a successful appointment cancellation request.
 */
export const mockAppointmentCancelPost = http.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  () => new HttpResponse(null, {status: 204})
);

/**
 * Mock an appointment cancellation request with email validation error.
 */
export const mockAppointmentCancelErrorPost = http.post(
  `${BASE_URL}appointments/:uuid/cancel`,
  () =>
    HttpResponse.json(
      {
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
          } satisfies InvalidParam,
        ],
      },
      {status: 400}
    )
);
