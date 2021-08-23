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

  setItems(items, fromSearch) {
    super.setItems(items, fromSearch);
    if (this.component.showProducts) {
      get(`${this.options.baseUrl}appointment/products`)
          .then(results => {
            results.map(result => this.addOption(result.identifier, result.name));
          })
          .catch(error => console.log(error));
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('select');
    return info;
  }

  handleSettingProductLocations(data) {
    if (this.component.showLocations && data[this.component.productForLocations]) {
      get(`${this.options.baseUrl}appointment/locations`,
        {'product_id': data[this.component.productForLocations]})
        .then(results => {
            results.map(result => this.addOption(result.identifier, result.name));
        })
        .catch(error => console.log(error));
    }
  }

  handleSettingProductLocationDates(data) {
    if (this.component.showDates && data[this.component.productForDates] && data[this.component.locationForDates]) {
      get(`${this.options.baseUrl}appointment/dates`,
        {'product_id': data[this.component.productForDates],
                 'location_id': data[this.component.locationForDates]})
        .then(results => {
            results.map(result => this.addOption(result, result));
        })
        .catch(error => console.log(error));
    }
  }

  fieldLogic(data, row) {
    const changed = super.fieldLogic(data, row);
    this.handleSettingProductLocations(data);
    this.handleSettingProductLocationDates(data);
    return changed;
  }
}


export default Select;
