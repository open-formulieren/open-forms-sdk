import {getFormattedDateString, getFormattedTimeString} from '../../utils';

const appointmentsComponentHook = component => {
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

const configureProductOptions = component => {
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

const urlTemplateFactory = (path, getQuery) => {
  // use a function, as the protected evaluator can't handle the coalesce behaviour.
  // See Github issue #1374 for more information.
  // Formio 4.12, 4.13 and current master (at the time of writing) do not seem to be
  // thinking about deprecating functions as template 'source' at the moment.
  const url = context => {
    const {row, instance} = context;
    const query = new URLSearchParams(getQuery(row));
    return `${instance.options.baseUrl}${path}?${query.toString()}`;
  };
  // monkeypatch this stuff, as Formio calls it and expects a string... sigh
  url.startsWith = arg => false;
  return url;
};

const configureLocationOptions = component => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showLocations) return;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;

  const getQuery = row => {
    const currentValue = row[productComponentKey].identifier ?? row[productComponentKey];
    return {product_id: currentValue};
  };

  const url = urlTemplateFactory('appointments/locations', getQuery);

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

const configureDateOptions = component => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showDates) return;

  const intl = component.options.intl;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;
  const locationComponentKey = appointmentsOptions.locationComponent;

  const getQuery = row => {
    const currentProduct = row[productComponentKey].identifier ?? row[productComponentKey];
    const currentLocation = row[locationComponentKey].identifier ?? row[locationComponentKey];
    return {
      product_id: currentProduct,
      location_id: currentLocation,
    };
  };

  const url = urlTemplateFactory('appointments/dates', getQuery);

  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'date',
    template: ({item}) => {
      const formatted = getFormattedDateString(intl, item.date);
      return `<span>${formatted}</span>`;
    },
    refreshOn: [productComponentKey, locationComponentKey],
    refreshOnBlur: [productComponentKey, locationComponentKey],
    clearOnRefresh: true,
    ignoreCache: true,
    lazyLoad: false,
  });
};

const configureTimeOptions = component => {
  const appointmentsOptions = component.component.appointments;
  if (!appointmentsOptions.showTimes) return;

  const intl = component.options.intl;

  // TODO: account for possible nesting!
  const productComponentKey = appointmentsOptions.productComponent;
  const locationComponentKey = appointmentsOptions.locationComponent;
  const dateComponentKey = appointmentsOptions.dateComponent;

  const getQuery = row => {
    const currentProduct = row[productComponentKey].identifier ?? row[productComponentKey];
    const currentLocation = row[locationComponentKey].identifier ?? row[locationComponentKey];
    return {
      product_id: currentProduct,
      location_id: currentLocation,
      date: row[dateComponentKey],
    };
  };

  const url = urlTemplateFactory('appointments/times', getQuery);

  Object.assign(component.component, {
    dataSrc: 'url',
    data: {url, method: 'GET'},
    valueProperty: 'time',
    template: ({item}) => {
      const formatted = getFormattedTimeString(intl, item.time);
      return `<span>${formatted}</span>`;
    },
    refreshOn: [productComponentKey, locationComponentKey, dateComponentKey],
    refreshOnBlur: [productComponentKey, locationComponentKey, dateComponentKey],
    clearOnRefresh: true,
    ignoreCache: true,
    lazyLoad: false,
  });
};

export default appointmentsComponentHook;
