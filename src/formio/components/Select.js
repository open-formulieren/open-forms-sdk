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
    if (this.component.appointmentsShowProducts || this.component.appointmentsShowLocations ||
        this.component.appointmentsShowDates || this.component.appointmentsShowTimes) {
      this.component.disabled = true;
    }
    if (this.component.appointmentsShowProducts) {
      this.handleSettingAppointmentProducts();
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('select');
    return info;
  }

  handleSettingAppointmentProducts() {
    if (this.component.appointmentsShowProducts) {
      get(`${this.options.baseUrl}appointments/products`)
          .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
            this.element.lastElementChild.removeAttribute("disabled");
          })
          .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentLocations(data) {
    if (this.component.appointmentsShowLocations &&
        this.selectOptions.length === 0 &&
        data[this.component.appointmentsProductForLocations]) {
      get(`${this.options.baseUrl}appointments/locations`,
        {'product_id': data[this.component.appointmentsProductForLocations]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
            this.element.lastElementChild.removeAttribute("disabled");
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentDates(data) {
    if (this.component.appointmentsShowDates &&
        this.selectOptions.length === 0 &&
        data[this.component.appointmentsProductForDates] &&
        data[this.component.appointmentsLocationForDates]) {
      get(`${this.options.baseUrl}appointments/dates`,
        {'product_id': data[this.component.appointmentsProductForDates],
         'location_id': data[this.component.appointmentsLocationForDates]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.date, getFormattedDateString(this.options.intl, result.date)));
            this.element.lastElementChild.removeAttribute("disabled");
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentTimes(data) {
    if (this.component.appointmentsShowTimes &&
        this.selectOptions.length === 0 &&
        data[this.component.appointmentsProductForTimes] &&
        data[this.component.appointmentsLocationForTimes] &&
        data[this.component.appointmentsDateForTimes]) {
      get(`${this.options.baseUrl}appointments/times`,
        {'product_id': data[this.component.appointmentsProductForTimes],
         'location_id': data[this.component.appointmentsLocationForTimes],
         'date': data[this.component.appointmentsDateForTimes]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.time, getFormattedTimeString(this.options.intl, result.time)));
            this.element.lastElementChild.removeAttribute("disabled");
        })
        .catch(error => console.log(error));
    }
  }

  handleClearingAppointmentData(changedKey) {

    // Product is changed so clear locations
    const shouldClearLocations = this.component.appointmentsShowLocations &&
                                 this.component.appointmentsProductForLocations === changedKey;

    // Product or location is changed so clear dates
    const shouldClearDates = this.component.appointmentsShowDates &&
                             (this.component.appointmentsProductForDates === changedKey||
                              this.component.appointmentsLocationForDates === changedKey);

    // Product or location or date is changed so clear times
    const shouldClearTimes = this.component.appointmentsShowTimes &&
                             (this.component.appointmentsProductForTimes === changedKey ||
                              this.component.appointmentsLocationForTimes === changedKey ||
                              this.component.appointmentsDateForTimes === changedKey);

    if (shouldClearLocations || shouldClearDates || shouldClearTimes) {
      this.setValue(this.emptyValue);
      this.setItems([]);
      this.element.lastElementChild.setAttribute('disabled', 'disabled');
    }
  }

  activate() {
    if (!(this.component.appointmentsShowProducts || this.component.appointmentsShowLocations ||
          this.component.appointmentsShowDates || this.component.appointmentsShowTimes)) {
      super.activate();
    }
  }

  beforeSubmit() {
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
      this.handleClearingAppointmentData(flags.changed.instance.key);
    }
    this.handleSettingAppointmentLocations(data);
    this.handleSettingAppointmentDates(data);
    this.handleSettingAppointmentTimes(data);
    return super.checkData(data, flags, row);
  }
}


export default Select;
