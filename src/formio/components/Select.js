import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import {get} from "../../api";


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

  handleSettingProducts() {
    if (this.component.showProducts) {
      get(`${this.options.baseUrl}appointment/products`)
          .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
          })
          .catch(error => console.log(error));
    }
  }

  handleSettingProductLocations(data) {
    if (this.component.showLocations && typeof data[this.component.productForLocations] === "number" && !data[this.component.key]) {
      get(`${this.options.baseUrl}appointment/locations`,
        {'product_id': data[this.component.productForLocations]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result.identifier, result.name));
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingProductLocationDates(data) {
    if (this.component.showDates && data[this.component.productForDates]
        && data[this.component.locationForDates] && !data[this.component.key]) {
      get(`${this.options.baseUrl}appointment/dates`,
        {'product_id': data[this.component.productForDates],
                 'location_id': data[this.component.locationForDates]})
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result, result));
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingProductLocationDateTimes(data) {
    if (this.component.showTimes && data[this.component.productForTimes] &&
        data[this.component.locationForTimes] && data[this.component.dateForTimes] && !data[this.component.key]) {
      get(`${this.options.baseUrl}appointment/times`,
        {'product_id': data[this.component.productForTimes],
                 'location_id': data[this.component.locationForTimes],
                  'date': data[this.component.dateForTimes],
        })
        .then(results => {
            this.setItems([]);
            results.map(result => this.addOption(result, result.split("T")[1]));
        })
        .catch(error => console.log(error));
    }
  }

  handleClearingData(data) {
    // Product is empty so clear locations
    if (this.component.showLocations &&
        !data[this.component.productForLocations] &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
    // Product or location is empty so clear dates
    if (this.component.showDates &&
        (!data[this.component.productForDates]||
         !data[this.component.locationForDates]) &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
    // Product or location or date is empty so clear times
    if (this.component.showTimes &&
        (!data[this.component.productForTimes] ||
         !data[this.component.locationForTimes] ||
         !data[this.component.dateForTimes]) &&
        data[this.component.key]) {
      this.setValue(this.emptyValue);
    }
  }

  activate() {
    super.activate();
    if (this.component.showProducts || this.component.showLocations || this.component.showDates) {
      this.setValue(this.emptyValue);
    }
    if (this.component.showProducts) {
      this.handleSettingProducts();
    }
  }

  fieldLogic(data, row) {
    const changed = super.fieldLogic(data, row);
    this.handleClearingData(data);
    this.handleSettingProductLocations(data);
    this.handleSettingProductLocationDates(data);
    this.handleSettingProductLocationDateTimes(data);
    return changed;
  }
}


export default Select;
