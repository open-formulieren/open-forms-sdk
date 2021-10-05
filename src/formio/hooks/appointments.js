import {getFormattedDateString, getFormattedTimeString} from '../../utils';


const appointmentsComponentHook = (component) => {
  if (component.type !== 'select') return;

  // check if it's got to do anything with appointments
  const appointmentsOptions = component.component.appointments || {};
  const knownOptions = [
    appointmentsOptions.showProducts,
    appointmentsOptions.showLocations,
    appointmentsOptions.showDates,
    appointmentsOptions.showTimes,
  ];
  const isAppointmentDropdown = knownOptions.some(opt => !!opt);
  if (!isAppointmentDropdown) return;

  configureProductOptions(component);
  configureLocationOptions(component);
  configureDateOptions(component);
  configureTimeOptions(component);
};

const configureProductOptions = (component) => {
  if (!component.component.appointments.showProducts) return;
  // update the schema to add the data source to an API endpoint
  const url = `${component.options.baseUrl}appointments/products`;
  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'identifier',
    template: '{{ item.name }}',
    lazyLoad: false,
  });
};

const configureLocationOptions = (component) => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showLocations) return;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;
  // can't use URLSearchParams because the template markers are escaped
  const query = `product_id={{ row.${productComponentKey}.identifier || row.${productComponentKey} }}`;
  const url = `${component.options.baseUrl}appointments/locations?${query}`;
  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'identifier',
    template: '{{ item.name }}',
    refreshOn: productComponentKey,
    refreshOnBlur: productComponentKey,
    clearOnRefresh: true,
    ignoreCache: true,
    lazyLoad: false,
  });
};

const configureDateOptions = (component) => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showDates) return;

  const intl = component.options.intl;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;
  const locationComponentKey = appointmentsOptions.locationComponent;

  // can't use URLSearchParams because the template markers are escaped
  const query = [
    `product_id={{ row.${productComponentKey}.identifier || row.${productComponentKey} }}`,
    `location_id={{ row.${locationComponentKey}.identifier || row.${locationComponentKey} }}`
  ].join('&');
  const url = `${component.options.baseUrl}appointments/dates?${query}`;

  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'date',
    template: ({ item }) => {
      const formatted = getFormattedDateString(intl, item.date);
      return `<span>${formatted}</span>`;
    },
    refreshOn: [
      productComponentKey,
      locationComponentKey,
    ],
    refreshOnBlur: [
      productComponentKey,
      locationComponentKey,
    ],
    clearOnRefresh: true,
    ignoreCache: true,
    lazyLoad: false,
  });
};

const configureTimeOptions = (component) => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showTimes) return;

  const intl = component.options.intl;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;
  const locationComponentKey = appointmentsOptions.locationComponent;
  const dateComponentKey = appointmentsOptions.dateComponent;

  // can't use URLSearchParams because the template markers are escaped
  const query = [
    `product_id={{ row.${productComponentKey}.identifier || row.${productComponentKey} }}`,
    `location_id={{ row.${locationComponentKey}.identifier || row.${locationComponentKey} }}`,
    `date={{ row.${dateComponentKey} }}`,
  ].join('&');
  const url = `${component.options.baseUrl}appointments/times?${query}`;

  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'time',
    template: ({ item }) => {
      const formatted = getFormattedTimeString(intl, item.time);
      return `<span>${formatted}</span>`;
    },
    refreshOn: [
      productComponentKey,
      locationComponentKey,
      dateComponentKey,
    ],
    refreshOnBlur: [
      productComponentKey,
      locationComponentKey,
      dateComponentKey,
    ],
    clearOnRefresh: true,
    ignoreCache: true,
    lazyLoad: false,
  });
};

export default appointmentsComponentHook;
