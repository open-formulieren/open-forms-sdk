import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import { get } from '../../api';


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
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('select');
    return info;
  }

  handleSettingAppointmentProducts() {
    if (this.component.appointments.showProducts) {
      get(`${this.options.baseUrl}appointments/products`)
          .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
          })
          .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentLocations(data) {
    if (this.component.appointments.showLocations &&
        data[this.component.appointments.productForLocations] &&
        !data[this.component.key]) {
      get(`${this.options.baseUrl}appointments/locations`,
        {'product_id': data[this.component.appointments.productForLocations]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentDates(data) {
    if (this.component.appointments.showDates && data[this.component.appointments.productForDates]
        && data[this.component.appointments.locationForDates] && !data[this.component.key]) {
      get(`${this.options.baseUrl}appointments/dates`,
        {'product_id': data[this.component.appointments.productForDates],
         'location_id': data[this.component.appointments.locationForDates]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.date, result.date));
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentTimes(data) {

    if (this.component.appointments.showTimes && data[this.component.appointments.productForTimes] &&
        data[this.component.appointments.locationForTimes] && data[this.component.appointments.dateForTimes] &&
        !data[this.component.key]) {
      get(`${this.options.baseUrl}appointments/times`,
        {'product_id': data[this.component.appointments.productForTimes],
         'location_id': data[this.component.appointments.locationForTimes],
         'date': data[this.component.appointments.dateForTimes]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.time, result.time.split("T")[1].split('+')[0]));
        })
        .catch(error => console.log(error));
    }
  }

  handleClearingAppointmentData(data) {
    // Product is empty so clear locations
    if (this.component.appointments.showLocations &&
        !data[this.component.appointments.productForLocations] &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
    // Product or location is empty so clear dates
    if (this.component.appointments.showDates &&
        (!data[this.component.appointments.productForDates]||
         !data[this.component.appointments.locationForDates]) &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
    // Product or location or date is empty so clear times
    if (this.component.appointments.showTimes &&
        (!data[this.component.appointments.productForTimes] ||
         !data[this.component.appointments.locationForTimes] ||
         !data[this.component.appointments.dateForTimes]) &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
  }

  activate() {
    super.activate();
    if (this.component.appointments.showProducts || this.component.appointments.showLocations ||
        this.component.appointments.showDates || this.component.appointments.showTimes) {
      this.setValue(this.emptyValue);
    }
    if (this.component.appointments.showProducts) {
      this.handleSettingAppointmentProducts();
    }
  }

  fieldLogic(data, row) {
    const changed = super.fieldLogic(data, row);
    this.handleClearingAppointmentData(data);
    this.handleSettingAppointmentLocations(data);
    this.handleSettingAppointmentDates(data);
    this.handleSettingAppointmentTimes(data);
    return changed;
  }
}


export default Select;
