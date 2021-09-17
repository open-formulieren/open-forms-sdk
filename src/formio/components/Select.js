import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import { get } from '../../api';
import {getFormattedDateString, getFormattedTimeString} from '../../utils';


/**
 * Extend the default select field to modify it to our needs.
 */
class Select extends Formio.Components.components.select {
  constructor(component, options, data) {
    super(component, options, data);

    // setting the widget to html5 instead of null ensures that the select gets rendered,
    // instead of the whole wrapper that replaces the <select> element (and messes with styling).
    // We're deliberately forcing this, as we have dysfunctional styles for anything else.
    this.component.widget = 'html5';

    const appointmentsOptions = this.component.appointments || {};
    this._appointmentsOptions = appointmentsOptions;
    const knownOptions = [
      appointmentsOptions.showProducts,
      appointmentsOptions.showLocations,
      appointmentsOptions.showDates,
      appointmentsOptions.showTimes,
    ];
    const isAppointmentDropdown = knownOptions.some(opt => !!opt);
    this._isAppointmentDropdown = isAppointmentDropdown;
    if (isAppointmentDropdown) {
      this.component.disabled = true;
    }

    if (appointmentsOptions.showProducts) {
      this.setAppointmentProductOptions();
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('select');
    return info;
  }

  _reEnable() {
    this.element.lastElementChild.removeAttribute("disabled");
  }

  setAppointmentProductOptions() {
    if (this._appointmentsOptions.showProducts) {
      get(`${this.options.baseUrl}appointments/products`)
          .then(results => {
            this.setItems([]);
            results.forEach(result => this.addOption(result.identifier, result.name));
            this._reEnable();
          })
          .catch(console.error);
    }
  }

  setAppointmentLocationOptions(data) {
    const isEmptyLocationDropdown = this._appointmentsOptions.showLocations && this.selectOptions.length === 0;
    if (!isEmptyLocationDropdown) return;

    const productComponentKey = this._appointmentsOptions.productComponent;
    const productId = data[productComponentKey];
    const url = `${this.options.baseUrl}appointments/locations`;

    if (productId) {
      get(url, {'product_id': productId})
        .then(results => {
            this.setItems([]);
            results.forEach(result => this.addOption(result.identifier, result.name));
            this._reEnable();
        })
        .catch(console.error);
    }
  }

  setAppointmentDateOptions(data) {
    const isEmptyDateDropdown = this._appointmentsOptions.showDates && this.selectOptions.length === 0;
    if (!isEmptyDateDropdown) return;

    const productComponentKey = this._appointmentsOptions.productComponent;
    const locationComponentKey = this._appointmentsOptions.locationComponent;
    const productId = data[productComponentKey];
    const locationId = data[locationComponentKey];
    const url = `${this.options.baseUrl}appointments/dates`;

    if (data[productComponentKey] && data[locationComponentKey]) {
      get(url, {'product_id': productId, 'location_id': locationId})
        .then(results => {
            this.setItems([]);
            results.forEach(result => this.addOption(result.date, getFormattedDateString(this.options.intl, result.date)));
            this._reEnable();
        })
        .catch(console.error);
    }
  }

  setAppointmentTimeOptions(data) {
    const isEmptyTimeDropdown = this._appointmentsOptions.showTimes && this.selectOptions.length === 0;
    if (!isEmptyTimeDropdown) return;

    const productComponentKey = this._appointmentsOptions.productComponent;
    const locationComponentKey = this._appointmentsOptions.locationComponent;
    const dateComponentKey = this._appointmentsOptions.dateComponent;
    const productId = data[productComponentKey];
    const locationId = data[locationComponentKey];
    const date = data[dateComponentKey];
    const url = `${this.options.baseUrl}appointments/times`;

    if (productId && locationId && date) {
      const query = {
        'product_id': productId,
        'location_id': locationId,
        'date': date,
      };
      get(url, query)
        .then(results => {
            this.setItems([]);
            results.forEach(result => this.addOption(result.time, getFormattedTimeString(this.options.intl, result.time)));
            this._reEnable();
        })
        .catch(console.error);
    }
  }

  clearAppointmentData(changedKey) {
    // Product is changed so clear locations
    const shouldClearLocations = (
      this._appointmentsOptions.showLocations
      && this._appointmentsOptions.productComponent === changedKey
    );

    // Product or location is changed so clear dates
    const shouldClearDates = (
      this._appointmentsOptions.showDates
      && [
        this._appointmentsOptions.productComponent,
        this._appointmentsOptions.locationComponent,
      ].includes(changedKey)
    );

    // Product or location or date is changed so clear times
    const shouldClearTimes = (
      this._appointmentsOptions.showTimes
      && [
        this._appointmentsOptions.productComponent,
        this._appointmentsOptions.locationComponent,
        this._appointmentsOptions.dateComponent,
      ].includes(changedKey)
    );

    if (shouldClearLocations || shouldClearDates || shouldClearTimes) {
      this.setValue(this.emptyValue);
      this.setItems([]);
      this.element.lastElementChild.setAttribute('disabled', 'disabled');
    }
  }

  activate() {
    if (this._isAppointmentDropdown) return;
    super.activate();
  }

  beforeSubmit() {
    // TODO: check if we can solve this via getOptionValue method instead of monkey-patching
    // state. See also https://github.com/open-formulieren/open-forms/issues/682 which
    // might help put the options in the React state, giving easy access to display logic
    // in the summary page.
    if (this.component.appointmentsShowProducts || this.component.appointmentsShowLocations) {
      // For these two types of components we need to send both the identifier and name to the backend
      const value = this._data[this.component.key].toString();
      const selectedOption = this.selectOptions.filter(option => option.value === value)[0];
      this._data[this.component.key] = {identifier: selectedOption.value, name: selectedOption.label};
    }
    super.beforeSubmit();
  }

  checkData(data, flags, row) {
    if (flags.changed) {
      this.clearAppointmentData(flags.changed.instance.key);
    }
    this.setAppointmentLocationOptions(data);
    this.setAppointmentDateOptions(data);
    this.setAppointmentTimeOptions(data);
    return super.checkData(data, flags, row);
  }
}


export default Select;
