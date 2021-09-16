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
    if (this.component['appointments.showProducts'] || this.component['appointments.showLocations'] ||
        this.component['appointments.showDates'] || this.component['appointments.showTimes']) {
      this.component.disabled = true;
    }
    if (this.component['appointments.showProducts']) {
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
    if (this.component['appointments.showProducts']) {
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
    if (this.component['appointments.showLocations'] &&
        this.selectOptions.length === 0 &&
        data[this.component['appointments.productComponent']]) {
      get(`${this.options.baseUrl}appointments/locations`,
        {'product_id': data[this.component['appointments.productComponent']]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
            this.element.lastElementChild.removeAttribute("disabled");
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentDates(data) {
    if (this.component['appointments.showDates'] &&
        this.selectOptions.length === 0 &&
        data[this.component['appointments.productComponent']] &&
        data[this.component['appointments.locationComponent']]) {
      get(`${this.options.baseUrl}appointments/dates`,
        {'product_id': data[this.component['appointments.productComponent']],
         'location_id': data[this.component['appointments.locationComponent']]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.date, getFormattedDateString(this.options.intl, result.date)));
            this.element.lastElementChild.removeAttribute("disabled");
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingAppointmentTimes(data) {
    if (this.component['appointments.showTimes'] &&
        this.selectOptions.length === 0 &&
        data[this.component['appointments.productComponent']] &&
        data[this.component['appointments.locationComponent']] &&
        data[this.component['appointments.dateComponent']]) {
      get(`${this.options.baseUrl}appointments/times`,
        {'product_id': data[this.component['appointments.productComponent']],
         'location_id': data[this.component['appointments.locationComponent']],
         'date': data[this.component['appointments.dateComponent']]})
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
    const shouldClearLocations = this.component['appointments.showLocations'] &&
                                 this.component['appointments.productComponent'] === changedKey;

    // Product or location is changed so clear dates
    const shouldClearDates = this.component['appointments.showDates'] &&
                             (this.component['appointments.productComponent'] === changedKey||
                              this.component['appointments.locationComponent'] === changedKey);

    // Product or location or date is changed so clear times
    const shouldClearTimes = this.component['appointments.showTimes'] &&
                             (this.component['appointments.productComponent'] === changedKey ||
                              this.component['appointments.locationComponent'] === changedKey ||
                              this.component['appointments.dateComponent'] === changedKey);

    if (shouldClearLocations || shouldClearDates || shouldClearTimes) {
      this.setValue(this.emptyValue);
      this.setItems([]);
      this.element.lastElementChild.setAttribute('disabled', 'disabled');
    }
  }

  activate() {
    if (!(this.component['appointments.showProducts'] || this.component['appointments.showLocations'] ||
          this.component['appointments.showDates'] || this.component['appointments.showTimes'])) {
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
